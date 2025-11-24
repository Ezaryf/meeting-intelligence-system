resource "aws_db_subnet_group" "main" {
  name       = "main"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = {
    Name = "Main DB subnet group"
  }
}

resource "aws_db_instance" "default" {
  allocated_storage    = 20
  db_name              = "meeting_intelligence"
  engine               = "postgres"
  engine_version       = "14"
  instance_class       = "db.t3.micro" # Using t3.micro for cost saving in dev, use larger for prod
  username             = "dbadmin"
  password             = "securepassword123" # In prod, use Secrets Manager
  parameter_group_name = "default.postgres14"
  skip_final_snapshot  = true
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
}
