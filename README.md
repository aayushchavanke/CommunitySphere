## Cloud Architecture

```mermaid
graph TD
    %% External Elements
    Users((Internet))
    TF{{Terraform <br/> Infrastructure as Code}} 

    %% AWS Cloud Environment
    subgraph AWS [AWS Region: ap-south-1]
        direction TB
        subgraph VPC [CommunitySphere VPC]
            IGW[Internet Gateway]
            
            subgraph ALB_SG [alb-sg: Allows requests from anywhere]
                ALB[Application Load Balancer]
            end
            
            subgraph AZ_A [Availability Zone: ap-south-1a]
                subgraph Pub1 [Public Subnet 1]
                    EC2_A[EC2 Instance A <br/> Apache/PHP]
                end
                subgraph Priv1 [Private Subnet 1]
                    RDS[(Amazon RDS <br/> MySQL Database)]
                end
            end
            
            subgraph AZ_B [Availability Zone: ap-south-1b]
                subgraph Pub2 [Public Subnet 2]
                    EC2_B[EC2 Instance B <br/> Apache/PHP]
                end
                subgraph Priv2 [Private Subnet 2]
                    Isolated[Isolated Backend]
                    style Isolated fill:none,stroke:none
                end
            end
            
            CW((Amazon CloudWatch <br/> Auto Scaling Group))
        end
    end

    %% Provisioning
    TF -.->|Provisions & Manages| VPC
    
    %% Traffic Flow
    Users <--> IGW
    IGW <--> ALB
    
    %% Web Security Group Logic
    ALB ==>|web-sg: Allows traffic <br/> only from ALB| EC2_A
    ALB ==>|web-sg: Allows traffic <br/> only from ALB| EC2_B
    
    %% Database Security Group Logic
    EC2_A ==>|db-sg: Allows access <br/> only from web-sg| RDS
    EC2_B ==>|db-sg: Allows access <br/> only from web-sg| RDS
    
    %% Monitoring
    CW -.->|Monitors CPU| EC2_A
    CW -.->|Monitors CPU| EC2_B
