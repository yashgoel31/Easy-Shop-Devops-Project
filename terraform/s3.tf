resource "aws_s3_bucket" "easyshop_assets" {
  bucket        = "easyshop-production-assets-${var.aws_region}"
  force_destroy = false

  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "assets_versioning" {
  bucket = aws_s3_bucket.easyshop_assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets_encryption" {
  bucket = aws_s3_bucket.easyshop_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
