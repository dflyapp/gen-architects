-- Seed the four projects that previously lived in src/data/model.ts.
-- Explicit IDs keep /work/1 through /work/4 stable.

INSERT INTO `projects` (
  `id`, `name`, `cover_url`, `cover_key`, `cover_desc`, `category`, `tag`,
  `location`, `description`, `published`, `sort_order`, `created_at`, `updated_at`
) VALUES
  (
    1,
    '59 HOUSE',
    '/assets/img/cover1.jpg',
    NULL,
    'Exterior perspective',
    'HOUSE',
    'GEN 16—004',
    'Gò Vấp, TP. Hồ Chí Minh',
    'The process of context research has brought us to the typical tropical architectural form of the site location. We have chosen to demonstrate the form of two layers of walls with a light outer wall made of ball breeze concrete blocks and carry to the shape of the facade.',
    1,
    1,
    '2025-01-01T00:00:00.000Z',
    '2025-01-01T00:00:00.000Z'
  ),
  (
    2,
    'PHAN THIET HOUSE',
    '/assets/img/cover2.jpg',
    NULL,
    'Exterior perspective',
    'COUNTRY HOUSE',
    'GEN 19—205',
    'PHAN THIET - VIETNAM',
    'In the mood of a sunny and sandy tropical air, the concept came up with a traditional country house form with details of a sloped roof, porch, and solid and hollow bricks to minimize the solar radiation entering the building, and combine that with modern materials to resist corrosion from the sea air.',
    1,
    2,
    '2025-01-01T00:00:00.000Z',
    '2025-01-01T00:00:00.000Z'
  ),
  (
    3,
    'VINHOME CENTRAL PARK',
    '/assets/img/cover3.jpg',
    NULL,
    'Exterior perspective',
    'APARTMENT',
    'GEN 17—002',
    'BINH THANH - TPHCM',
    'For interior space, designers proposed the style of the North of Europe - Scandinavian. In the spirit of minimalism - functionality - comfort has been conveyed into the spaces inside the building.',
    1,
    3,
    '2025-01-01T00:00:00.000Z',
    '2025-01-01T00:00:00.000Z'
  ),
  (
    4,
    'TEN LUA HOUSE ',
    '/assets/img/cover4.jpg',
    NULL,
    'Exterior perspective',
    'HOUSE',
    'GEN 18—001',
    'BINH TAN - TPHCM',
    'Typical design solution of Vietnamese townhouses, with minimalist modern lines, balconies, loggias, and trees came between, taking advantage of old furniture items but carrying many memories have reused them to combine with suitable spaces.',
    1,
    4,
    '2025-01-01T00:00:00.000Z',
    '2025-01-01T00:00:00.000Z'
  );

INSERT INTO `project_packages` (`project_id`, `label`, `sort_order`) VALUES
  (1, 'Site Analysis', 1),
  (1, 'Concept Design', 2),
  (1, 'Planning Process', 3),
  (1, 'Technical Design', 4),
  (1, 'On Site Assistance', 5),
  (2, 'Site Analysis', 1),
  (2, 'Concept Design', 2),
  (2, 'Planning Process', 3),
  (2, 'Technical Design', 4),
  (2, 'On Site Assistance', 5),
  (3, 'Site Analysis', 1),
  (3, 'Concept Design', 2),
  (3, 'Planning Process', 3),
  (3, 'Technical Design', 4),
  (3, 'On Site Assistance', 5),
  (4, 'Site Analysis', 1),
  (4, 'Concept Design', 2),
  (4, 'Planning Process', 3),
  (4, 'Technical Design', 4),
  (4, 'On Site Assistance', 5);

INSERT INTO `project_images` (
  `project_id`, `url`, `r2_key`, `detail`, `sort_order`
) VALUES
  (1, '/assets/img/1/1.jpg', NULL, 'unknown', 1),
  (1, '/assets/img/1/2.jpg', NULL, 'Living room', 2),
  (1, '/assets/img/1/3.jpg', NULL, 'Master bedroom', 3),
  (1, '/assets/img/1/4.jpg', NULL, 'Kitchen space', 4),
  (1, '/assets/img/1/5.jpg', NULL, 'Sleeping and working space', 5),
  (1, '/assets/img/1/6.jpg', NULL, 'Facade perspective', 6),
  (2, '/assets/img/2/1.jpg', NULL, 'unknown', 1),
  (2, '/assets/img/2/2.jpg', NULL, 'Image from brick background', 2),
  (2, '/assets/img/2/3.jpg', NULL, 'Kitchen space', 3),
  (2, '/assets/img/2/4.jpg', NULL, 'Courtyard', 4),
  (2, '/assets/img/2/5.jpg', NULL, 'Exterior perspective', 5),
  (3, '/assets/img/3/1.jpg', NULL, 'unknown', 1),
  (3, '/assets/img/3/2.jpg', NULL, 'Living room', 2),
  (3, '/assets/img/3/3.jpg', NULL, 'Living room and dining space', 3),
  (3, '/assets/img/3/4.jpg', NULL, 'Entrance', 4),
  (3, '/assets/img/3/5.jpg', NULL, 'Master bedroom', 5),
  (3, '/assets/img/3/6.jpg', NULL, 'Child''s bedroom', 6),
  (4, '/assets/img/4/1.jpg', NULL, 'unknown', 1),
  (4, '/assets/img/4/2.jpg', NULL, 'Kitchen space', 2),
  (4, '/assets/img/4/3.jpg', NULL, 'Living room', 3),
  (4, '/assets/img/4/4.jpg', NULL, 'Kitchen space', 4),
  (4, '/assets/img/4/5.jpg', NULL, 'Master bedroom', 5),
  (4, '/assets/img/4/6.jpg', NULL, 'Music room', 6);
