-- AlterTable
ALTER TABLE "public"."Todo" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Todo_userId_idx" ON "public"."Todo"("userId");
