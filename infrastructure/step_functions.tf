resource "aws_sfn_state_machine" "sfn_state_machine" {
  name     = "meeting-processing-pipeline"
  role_arn = aws_iam_role.step_functions_role.arn

  definition = <<EOF
{
  "Comment": "Meeting Processing Pipeline",
  "StartAt": "ExtractAudio",
  "States": {
    "ExtractAudio": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.extract_audio.arn}",
      "Next": "ParallelProcessing"
    },
    "ParallelProcessing": {
      "Type": "Parallel",
      "Branches": [
        {
          "StartAt": "ExtractFrames",
          "States": {
            "ExtractFrames": {
              "Type": "Task",
              "Resource": "${aws_lambda_function.extract_frames.arn}",
              "End": true
            }
          }
        }
        # Add other branches here
      ],
      "End": true
    }
  }
}
EOF
}

resource "aws_iam_role" "step_functions_role" {
  name = "meeting_intelligence_step_functions_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "states.amazonaws.com"
        }
      }
    ]
  })
}
