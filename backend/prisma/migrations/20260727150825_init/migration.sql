-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DONOR', 'RECIPIENT', 'HOSPITAL_STAFF', 'COORDINATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "DonorStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'SNOOZED', 'INELIGIBLE', 'UNCONFIRMED');

-- CreateEnum
CREATE TYPE "VerificationTier" AS ENUM ('TIER_0', 'TIER_1');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('CREATED', 'SEARCHING', 'MATCHED', 'FULFILLED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('NOTIFIED', 'RESPONDED', 'ACCEPTED', 'ARRIVED', 'DONATED', 'NO_SHOW', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('CRITICAL', 'URGENT', 'PLANNED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('PUSH', 'SMS');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('HOSPITAL', 'BLOOD_BANK', 'NGO', 'COLLEGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "phoneVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "tokenVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceName" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "lastUsedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "gender" "Gender" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "status" "DonorStatus" NOT NULL DEFAULT 'AVAILABLE',
    "verificationTier" "VerificationTier" NOT NULL DEFAULT 'TIER_0',
    "reliability" INTEGER NOT NULL DEFAULT 100,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "location" geography(Point,4326),
    "lastDonatedAt" TIMESTAMP(3),
    "nextEligibleAt" TIMESTAMP(3),
    "lastAvailabilityUpdate" TIMESTAMP(3),
    "lastLocationUpdate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DonorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InstitutionType" NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "googlePlaceId" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "location" geography(Point,4326),
    "inventory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodRequest" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "institutionId" TEXT,
    "requiredBloodGroup" "BloodGroup" NOT NULL,
    "unitsRequested" INTEGER NOT NULL DEFAULT 1,
    "unitsFulfilled" INTEGER NOT NULL DEFAULT 0,
    "urgency" "Urgency" NOT NULL DEFAULT 'URGENT',
    "status" "RequestStatus" NOT NULL DEFAULT 'CREATED',
    "hospitalName" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "location" geography(Point,4326),
    "patientNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BloodRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'NOTIFIED',
    "waveNumber" INTEGER NOT NULL DEFAULT 1,
    "notifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "matchId" TEXT,
    "requestId" TEXT,
    "donorId" TEXT NOT NULL,
    "institutionId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "certificateUrl" TEXT,
    "donatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "template" TEXT NOT NULL,
    "payload" JSONB,
    "provider" TEXT,
    "providerId" TEXT,
    "providerResponse" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "failureReason" TEXT,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InstitutionStaff" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "UserRole_role_idx" ON "UserRole"("role");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_role_key" ON "UserRole"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DonorProfile_userId_key" ON "DonorProfile"("userId");

-- CreateIndex
CREATE INDEX "DonorProfile_status_idx" ON "DonorProfile"("status");

-- CreateIndex
CREATE INDEX "DonorProfile_bloodGroup_idx" ON "DonorProfile"("bloodGroup");

-- CreateIndex
CREATE INDEX "DonorProfile_createdAt_idx" ON "DonorProfile"("createdAt");

-- CreateIndex
CREATE INDEX "DonorProfile_location_idx" ON "DonorProfile" USING GIST ("location");

-- CreateIndex
CREATE INDEX "Institution_type_idx" ON "Institution"("type");

-- CreateIndex
CREATE INDEX "Institution_createdAt_idx" ON "Institution"("createdAt");

-- CreateIndex
CREATE INDEX "Institution_location_idx" ON "Institution" USING GIST ("location");

-- CreateIndex
CREATE INDEX "BloodRequest_status_idx" ON "BloodRequest"("status");

-- CreateIndex
CREATE INDEX "BloodRequest_requiredBloodGroup_idx" ON "BloodRequest"("requiredBloodGroup");

-- CreateIndex
CREATE INDEX "BloodRequest_urgency_idx" ON "BloodRequest"("urgency");

-- CreateIndex
CREATE INDEX "BloodRequest_createdAt_idx" ON "BloodRequest"("createdAt");

-- CreateIndex
CREATE INDEX "BloodRequest_location_idx" ON "BloodRequest" USING GIST ("location");

-- CreateIndex
CREATE INDEX "Match_requestId_idx" ON "Match"("requestId");

-- CreateIndex
CREATE INDEX "Match_donorId_idx" ON "Match"("donorId");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE INDEX "Match_createdAt_idx" ON "Match"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Match_requestId_donorId_key" ON "Match"("requestId", "donorId");

-- CreateIndex
CREATE INDEX "Donation_donorId_idx" ON "Donation"("donorId");

-- CreateIndex
CREATE INDEX "Donation_institutionId_idx" ON "Donation"("institutionId");

-- CreateIndex
CREATE INDEX "Donation_verified_idx" ON "Donation"("verified");

-- CreateIndex
CREATE INDEX "Donation_createdAt_idx" ON "Donation"("createdAt");

-- CreateIndex
CREATE INDEX "NotificationLog_userId_idx" ON "NotificationLog"("userId");

-- CreateIndex
CREATE INDEX "NotificationLog_status_idx" ON "NotificationLog"("status");

-- CreateIndex
CREATE INDEX "NotificationLog_createdAt_idx" ON "NotificationLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "_InstitutionStaff_AB_unique" ON "_InstitutionStaff"("A", "B");

-- CreateIndex
CREATE INDEX "_InstitutionStaff_B_index" ON "_InstitutionStaff"("B");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonorProfile" ADD CONSTRAINT "DonorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BloodRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BloodRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstitutionStaff" ADD CONSTRAINT "_InstitutionStaff_A_fkey" FOREIGN KEY ("A") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstitutionStaff" ADD CONSTRAINT "_InstitutionStaff_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

