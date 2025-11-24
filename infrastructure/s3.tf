resource "aws_s3_bucket" "raw_meetings" {
  bucket = "meeting-intelligence-raw-files-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket" "processed_data" {
  bucket = "meeting-intelligence-processed-data-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket" "frames" {
  bucket = "meeting-intelligence-video-frames-${random_id.bucket_suffix.hex}"
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Lifecycle rule for raw bucket to transition to IA/Glacier
resource "aws_s3_bucket_lifecycle_configuration" "raw_lifecycle" {
  bucket = aws_s3_bucket.raw_meetings.id

  rule {
    id     = "archive_after_30_days"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
  }
}
