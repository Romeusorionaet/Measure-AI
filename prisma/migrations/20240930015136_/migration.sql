-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measures" (
    "id" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "image_url" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_id_key" ON "customers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_customer_code_key" ON "customers"("customer_code");

-- CreateIndex
CREATE UNIQUE INDEX "measures_id_key" ON "measures"("id");

-- CreateIndex
CREATE UNIQUE INDEX "measures_measure_datetime_key" ON "measures"("measure_datetime");

-- CreateIndex
CREATE INDEX "measures_customerId_measure_type_idx" ON "measures"("customerId", "measure_type");

-- AddForeignKey
ALTER TABLE "measures" ADD CONSTRAINT "measures_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
