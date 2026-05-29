CREATE TABLE `portal_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`portalUserId` int NOT NULL,
	`ticketId` int,
	`ticketNumber` varchar(32),
	`type` varchar(64) NOT NULL DEFAULT 'ticket_status_changed',
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAtUtc` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portal_notifications_id` PRIMARY KEY(`id`)
);
