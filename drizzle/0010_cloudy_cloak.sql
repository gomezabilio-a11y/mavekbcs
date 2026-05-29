CREATE TABLE `insights_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bannerSlug` varchar(256),
	`featured1Slug` varchar(256),
	`featured2Slug` varchar(256),
	`featured3Slug` varchar(256),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `insights_settings_id` PRIMARY KEY(`id`)
);
