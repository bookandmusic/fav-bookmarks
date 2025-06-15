-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "email" TEXT,
    "avatar" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_oauth" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "user_oauth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pid" INTEGER,
    "icon" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmark" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "categoryId" INTEGER,
    "userId" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "starCount" INTEGER,
    "readme" TEXT,
    "categoryId" INTEGER,
    "userId" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tag" (
    "projectId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "project_tag_pkey" PRIMARY KEY ("projectId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_username_idx" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_oauth_provider_providerId_idx" ON "user_oauth"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_oauth_provider_providerId_key" ON "user_oauth"("provider", "providerId");

-- CreateIndex
CREATE INDEX "category_userId_idx" ON "category"("userId");

-- CreateIndex
CREATE INDEX "category_pid_idx" ON "category"("pid");

-- CreateIndex
CREATE INDEX "bookmark_userId_idx" ON "bookmark"("userId");

-- CreateIndex
CREATE INDEX "bookmark_categoryId_idx" ON "bookmark"("categoryId");

-- CreateIndex
CREATE INDEX "tag_userId_idx" ON "tag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_userId_key" ON "tag"("name", "userId");

-- CreateIndex
CREATE INDEX "project_userId_idx" ON "project"("userId");

-- CreateIndex
CREATE INDEX "project_categoryId_idx" ON "project"("categoryId");

-- CreateIndex
CREATE INDEX "project_tag_tagId_idx" ON "project_tag"("tagId");

-- CreateIndex
CREATE INDEX "project_tag_projectId_idx" ON "project_tag"("projectId");

-- AddForeignKey
ALTER TABLE "user_oauth" ADD CONSTRAINT "user_oauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tag" ADD CONSTRAINT "project_tag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tag" ADD CONSTRAINT "project_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
