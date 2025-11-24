resource "aws_iam_role" "lambda_role" {
  name = "meeting_intelligence_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_role.name
}

# Placeholder for Lambda functions - in a real scenario, we'd zip the code and upload
resource "aws_lambda_function" "extract_audio" {
  filename      = "backend/processing/placeholder.zip" # This file needs to exist or be created
  function_name = "extract_audio"
  role          = aws_iam_role.lambda_role.arn
  handler       = "extract_audio.handler"
  runtime       = "python3.9"
  
  # Just a dummy file for now to prevent terraform errors if we were running it
  # In reality we would build this
}

resource "aws_lambda_function" "extract_frames" {
  filename      = "backend/processing/placeholder.zip"
  function_name = "extract_frames"
  role          = aws_iam_role.lambda_role.arn
  handler       = "extract_frames.handler"
  runtime       = "python3.9"
}
