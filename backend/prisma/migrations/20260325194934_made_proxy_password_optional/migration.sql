-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Proxy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "disabled" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Proxy" ("disabled", "host", "id", "password", "port", "username") SELECT "disabled", "host", "id", "password", "port", "username" FROM "Proxy";
DROP TABLE "Proxy";
ALTER TABLE "new_Proxy" RENAME TO "Proxy";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
