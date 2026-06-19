# TenTwo AssetFlow - Supabase Backend MVP

This is a GitHub Pages deployable frontend connected to a Supabase backend.

## What this version does

- User sign up / sign in with Supabase Auth
- Shared backend database for 2 to 3 users
- Upload AMF Excel or CSV files
- Import rows into Supabase
- Search and filter assets
- Add manual assets
- Edit existing assets
- Delete assets
- Track uploaded AMF/source files
- Export filtered results as CSV

## Columns included

Main asset columns:

- entry_no
- tracker_date
- amf_number
- vendor
- contractor
- site_id
- site_name
- asset_category
- asset_type
- asset_description
- quantity
- work_type
- source_status
- pallet_id
- pallet_status
- amf_file_name
- amf_date
- attachment_status
- banding_status
- return_status
- returned_date
- assigned_to
- att_id
- serial_number
- model_number
- part_number
- manufacturer
- warehouse_location
- condition
- notes
- raw_data
- search_text

## Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Copy and run `supabase/schema.sql`.
4. Go to Supabase Project Settings > API.
5. Copy the Project URL and anon public key.
6. Open `assets/js/config.js`.
7. Paste the Project URL and anon public key.
8. Upload all files to GitHub.
9. Enable GitHub Pages.
10. Open `dashboard.html`.

## Auth notes

This MVP uses shared team mode.

Any authenticated user can read, insert, update, and delete records.

That is okay for testing with 2 to 3 trusted users. For a real paid product, change this later to organization/team-based access.

## Sample data

Use `sample/amf-sample.csv` for upload testing.

## Important

Do not commit your Supabase service role key. Only use the anon public key in `config.js`.
