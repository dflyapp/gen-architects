CREATE TABLE `project_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`url` text NOT NULL,
	`r2_key` text,
	`detail` text DEFAULT '' NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_images_project_sort_idx` ON `project_images` (`project_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `project_packages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`label` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_packages_project_sort_idx` ON `project_packages` (`project_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`cover_url` text NOT NULL,
	`cover_key` text,
	`cover_desc` text DEFAULT '' NOT NULL,
	`category` text NOT NULL,
	`tag` text NOT NULL,
	`location` text NOT NULL,
	`description` text NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
