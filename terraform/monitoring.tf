resource "aws_cloudwatch_log_group" "eks_app_logs" {
  name              = "/aws/eks/easyshop/app"
  retention_in_days = 30

  tags = {
    Environment = "production"
    Application = "easyshop"
  }
}

resource "aws_cloudwatch_metric_alarm" "cluster_high_cpu" {
  alarm_name          = "easyshop-high-cpu-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Triggered when EKS worker node CPU exceeds 80%"

  dimensions = {
    AutoScalingGroupName = "easyshop-eks-workers"
  }
}
