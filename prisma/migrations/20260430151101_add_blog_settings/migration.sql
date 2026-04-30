-- CreateTable
CREATE TABLE "BlogSettings" (
    "id" TEXT NOT NULL,
    "siteTitle" TEXT NOT NULL DEFAULT 'AI Blog',
    "siteSubtitle" TEXT NOT NULL DEFAULT 'AI-assisted publishing',
    "accent" TEXT NOT NULL DEFAULT 'slate',
    "fontPair" TEXT NOT NULL DEFAULT 'serif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogSettings_pkey" PRIMARY KEY ("id")
);
