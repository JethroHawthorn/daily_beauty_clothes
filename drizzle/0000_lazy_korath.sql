DROP TABLE IF EXISTS `clothing_items`;
--> statement-breakpoint
DROP TABLE IF EXISTS `histories`;
--> statement-breakpoint
DROP TABLE IF EXISTS `users`;
--> statement-breakpoint
CREATE TABLE `clothing_items` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`fit` text,
	`color` text,
	`material` text,
	`season` text NOT NULL,
	`image_url` text,
	`is_favorite` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `histories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`purpose` text NOT NULL,
	`combo` text NOT NULL,
	`weather` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`phone_number` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_number_unique` ON `users` (`phone_number`);