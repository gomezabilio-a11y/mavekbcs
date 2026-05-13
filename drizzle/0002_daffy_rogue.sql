CREATE TABLE `portal_contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`portalUserId` int NOT NULL,
	`totalHours` decimal(8,2) NOT NULL DEFAULT '0',
	`usedHours` decimal(8,2) NOT NULL DEFAULT '0',
	`contractStartDate` timestamp,
	`contractEndDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portal_contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portal_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(128) NOT NULL,
	`passwordHash` varchar(256) NOT NULL,
	`companyName` varchar(256) NOT NULL,
	`email` varchar(320),
	`language` enum('en','ko','ja') NOT NULL DEFAULT 'en',
	`timezone` varchar(64) NOT NULL DEFAULT 'UTC',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portal_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `portal_users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketNumber` varchar(32) NOT NULL,
	`portalUserId` int NOT NULL,
	`title` varchar(512) NOT NULL,
	`description` text NOT NULL,
	`screenshotUrl` varchar(1024),
	`screenshotKey` varchar(512),
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`adminFeedback` text,
	`spentHours` decimal(6,2),
	`hoursDeducted` boolean NOT NULL DEFAULT false,
	`createdAtUtc` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvedAt` timestamp,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `tickets_ticketNumber_unique` UNIQUE(`ticketNumber`)
);
