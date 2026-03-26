-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "target_id" INTEGER NOT NULL,
    "proxy_id" INTEGER NOT NULL
);
