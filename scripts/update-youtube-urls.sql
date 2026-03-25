-- Run this in Neon SQL Editor to update YouTube URLs for all songs
BEGIN;

UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=2byQEjsb0gg' WHERE title = 'Knockin'' on Heaven''s Door';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=6hzrDeceEKc' WHERE title = 'Wonderwall';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=na47wMFfQCo' WHERE title = 'A Horse with No Name';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=zaGUr6wButE' WHERE title = 'Three Little Birds';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=0SZcGtj-LJQ' WHERE title = 'Love Me Do';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=IXdNnw99-Ic' WHERE title = 'Wish You Were Here';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=hwZNL7QVJjE' WHERE title = 'Stand By Me';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=QrY9eHkXTa4' WHERE title = 'Redemption Song';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=09839DpTctU' WHERE title = 'Hotel California';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=0sB3Fcw3fEk' WHERE title = 'House of the Rising Sun';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=QDYfEBY9NM4' WHERE title = 'Let It Be';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=ye5BuYf8q4o' WHERE title = 'Sweet Home Alabama';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=CnQ8N1KacJc' WHERE title = 'Good Riddance (Time of Your Life)';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=YrLk4vdY28Q' WHERE title = 'Hallelujah';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=UfmkgQRmmeE' WHERE title = 'Brown Eyed Girl';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=XFkzRNyygfk' WHERE title = 'Creep';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=RB-RcX5DS5A' WHERE title = 'The Scientist';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=1lWJXDG2i0A' WHERE title = 'Free Fallin''';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=x59kS2AOrGM' WHERE title = 'No Woman No Cry';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=1vrEljMfXYo' WHERE title = 'Take Me Home, Country Roads';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=QkF3oxziUI4' WHERE title = 'Stairway to Heaven';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=tAGnKpE4NCI' WHERE title = 'Nothing Else Matters';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=6Ejga4kJUts' WHERE title = 'Zombie';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=A_MjCqQoLLA' WHERE title = 'Hey Jude';
UPDATE "Song" SET "youtubeUrl" = 'https://youtube.com/watch?v=xwtdhWltSIg' WHERE title = 'Losing My Religion';

COMMIT;
