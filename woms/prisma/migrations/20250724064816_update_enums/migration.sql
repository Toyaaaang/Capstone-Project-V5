-- CreateEnum
CREATE TYPE "Role" AS ENUM ('warehouse_admin', 'warehouse_staff', 'manager', 'employee', 'engineering', 'operations_maintenance', 'budget_analyst', 'sub_office', 'finance', 'audit');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('engineering', 'operations_maintenance', 'finance', 'admin');

-- CreateEnum
CREATE TYPE "Suboffice" AS ENUM ('sub_office_a', 'sub_office_b', 'sub_office_c');

-- CreateEnum
CREATE TYPE "RoleRequestStatus" AS ENUM ('approved', 'rejected');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'employee',
    "department" "Department",
    "suboffice" "Suboffice",
    "isRoleConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "signature" TEXT,
    "idImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_request_records" (
    "id" TEXT NOT NULL,
    "requestedRole" "Role" NOT NULL,
    "status" "RoleRequestStatus" NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "processedById" TEXT,

    CONSTRAINT "role_request_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "role_request_records" ADD CONSTRAINT "role_request_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_request_records" ADD CONSTRAINT "role_request_records_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
