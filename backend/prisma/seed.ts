import { PrismaClient, Role, BloodGroup, Gender, DonorStatus, VerificationTier, InstitutionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing records (Optional, since we are doing a clean init)
  console.log('Clearing old records...');
  await prisma.auditLog.deleteMany({});
  await prisma.notificationLog.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.donation.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.donorProfile.deleteMany({});
  await prisma.userRole.deleteMany({});
  await prisma.bloodRequest.deleteMany({});
  await prisma.institution.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Admin User
  console.log('Creating Admin...');
  const adminUser = await prisma.user.create({
    data: {
      phone: '+919999999999',
      email: 'admin@raktsetu.org',
      name: 'RaktSetu Admin',
      phoneVerifiedAt: new Date(),
      roles: {
        create: [
          { role: Role.ADMIN },
          { role: Role.COORDINATOR }
        ]
      }
    }
  });

  // 3. Create Hospital Institution
  console.log('Creating Hospital Institution...');
  const hospital = await prisma.institution.create({
    data: {
      name: 'Vellore Government General Hospital',
      type: InstitutionType.HOSPITAL,
      phone: '+914162222222',
      email: 'contact@vgh.gov.in',
      address: 'Filterbed Road, Vellore, Tamil Nadu 632001',
      googlePlaceId: 'ChIJz-S8M369r0sR85-u2vDqTzY',
      latitude: 12.9234,
      longitude: 79.1345,
      inventory: {
        A_POS: 15,
        A_NEG: 5,
        B_POS: 20,
        B_NEG: 3,
        AB_POS: 8,
        AB_NEG: 2,
        O_POS: 25,
        O_NEG: 8
      }
    }
  });

  // Update PostGIS geography point for the institution
  await prisma.$executeRawUnsafe(
    `UPDATE "Institution" SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3`,
    hospital.longitude,
    hospital.latitude,
    hospital.id
  );

  // 4. Create 20 geocoded donor profiles with balanced blood groups
  // Center of coordinates: Vellore Fort (12.9272, 79.1304)
  console.log('Creating 20 geocoded donors with balanced blood groups...');
  
  const bloodGroupDistribution = [
    // O+ (5)
    { bg: BloodGroup.O_POS, name: 'Aarav Sharma' },
    { bg: BloodGroup.O_POS, name: 'Aditya Patel' },
    { bg: BloodGroup.O_POS, name: 'Vihaan Gupta' },
    { bg: BloodGroup.O_POS, name: 'Arjun Verma' },
    { bg: BloodGroup.O_POS, name: 'Sai Ram' },
    // O- (2)
    { bg: BloodGroup.O_NEG, name: 'Elena Gilbert' },
    { bg: BloodGroup.O_NEG, name: 'Damon Salvatore' },
    // A+ (4)
    { bg: BloodGroup.A_POS, name: 'Rohan Deshmukh' },
    { bg: BloodGroup.A_POS, name: 'Ishaan Iyer' },
    { bg: BloodGroup.A_POS, name: 'Ananya Roy' },
    { bg: BloodGroup.A_POS, name: 'Kavya Pillai' },
    // A- (2)
    { bg: BloodGroup.A_NEG, name: 'Stefan Salvatore' },
    { bg: BloodGroup.A_NEG, name: 'Caroline Forbes' },
    // B+ (3)
    { bg: BloodGroup.B_POS, name: 'Kabir Mehta' },
    { bg: BloodGroup.B_POS, name: 'Mira Nair' },
    { bg: BloodGroup.B_POS, name: 'Riya Sen' },
    // B- (1)
    { bg: BloodGroup.B_NEG, name: 'Bonnie Bennett' },
    // AB+ (2)
    { bg: BloodGroup.AB_POS, name: 'Dev Mukherjee' },
    { bg: BloodGroup.AB_POS, name: 'Zoya Khan' },
    // AB- (1)
    { bg: BloodGroup.AB_NEG, name: 'Alaric Saltzman' }
  ];

  for (let i = 0; i < bloodGroupDistribution.length; i++) {
    const donorInfo = bloodGroupDistribution[i];
    const phone = `+9190000000${String(i).padStart(2, '0')}`;
    
    // Add jitter around Vellore Fort center (approx 0.5 - 5km radius)
    const angle = (2 * Math.PI * i) / bloodGroupDistribution.length;
    const radius = 0.005 + (i * 0.002); // ~500m to 5km
    const latitude = 12.9272 + radius * Math.sin(angle);
    const longitude = 79.1304 + radius * Math.cos(angle);

    const user = await prisma.user.create({
      data: {
        phone,
        email: `${donorInfo.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        name: donorInfo.name,
        phoneVerifiedAt: new Date(),
        roles: {
          create: [{ role: Role.DONOR }]
        }
      }
    });

    const donorProfile = await prisma.donorProfile.create({
      data: {
        userId: user.id,
        bloodGroup: donorInfo.bg,
        gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
        dob: new Date(1985 + (i % 20), i % 12, 1),
        weight: 55 + (i * 1.5),
        status: DonorStatus.AVAILABLE,
        verificationTier: i % 5 === 0 ? VerificationTier.TIER_1 : VerificationTier.TIER_0,
        reliability: 90 + (i % 11),
        latitude,
        longitude,
        lastAvailabilityUpdate: new Date(),
        lastLocationUpdate: new Date(),
      }
    });

    // Update PostGIS geography point for this donor profile
    await prisma.$executeRawUnsafe(
      `UPDATE "DonorProfile" SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3`,
      longitude,
      latitude,
      donorProfile.id
    );
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
