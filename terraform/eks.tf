module "eks" {

  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  # EKS Cluster
  name               = local.name
  endpoint_public_access = true

  # EKS Add-ons
  addons = {
    coredns = {
      most_recent = true
    }

    kube-proxy = {
      most_recent = true
    }

    vpc-cni = {
      most_recent = true
    }
  }

  # VPC configuration
  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.public_subnets
  control_plane_subnet_ids = module.vpc.intra_subnets

  # EKS Managed Node Group
  eks_managed_node_groups = {

    tws-demo-ng = {

      min_size     = 1
      max_size     = 2
      desired_size = 2

      instance_types = ["m7i-flex.large"]

      capacity_type = "SPOT"

      disk_size = 35

      # Apply disk_size without creating a custom launch template
      use_custom_launch_template = false

      kubernetes_version = "1.33"

      # Attach the node group's security group
      # to the EKS cluster primary security group
      attach_cluster_primary_security_group = true

      tags = {
        Name        = "tws-demo-ng"
        Environment = "dev"
        ExtraTag    = "e-commerce-app"
      }
    }
  }

  tags = local.tags
}


# Get running EKS EC2 instances
data "aws_instances" "eks_nodes" {

  instance_tags = {
    "eks:cluster-name" = module.eks.cluster_name
  }

  filter {
    name   = "instance-state-name"
    values = ["running"]
  }

  depends_on = [module.eks]
}