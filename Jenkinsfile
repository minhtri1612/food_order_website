pipeline {
    agent any

    environment{
        APP_NAME = 'food-website'
        AWS_DEFAULT_REGION = 'ap-southeast-2'
        AWS_ECS_CLUSTER = 'my_order_app'
        AWS_ECS_SERVICE = 'food-website-service'
        AWS_ECS_TASK_DEFINITION = 'order-web'
    }

    stages {
        stage('Build App') {
            agent { docker { image 'node:18-alpine'; reuseNode true } }
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            agent { docker { image 'node:18-alpine'; reuseNode true } }
            steps {
                sh 'npm test' // Fail pipeline if tests fail
            }
        }

        stage('Deploy to AWS'){
            agent {
                docker{
                    image 'amazon/aws-cli'
                    args "--entrypoint=''"
                }
            }

            steps {
              withCredentials([usernamePassword(credentialsId: 'fd2cd5c2-7196-433d-8fad-3cec9cd8d460', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                  sh '''
                    aws --version
                    aws s3 ls
                    LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition.json --query 'taskDefinition.revision' --output text)
                    echo $LATEST_TD_REVISION
                    aws ecs update-service --cluster $AWS_ECS_CLUSTER --service $AWS_ECS_SERVICE --task-definition $AWS_ECS_TASK_DEFINITION:$LATEST_TD_REVISION
                    aws ecs wait services-stable --cluster $AWS_ECS_CLUSTER --services $AWS_ECS_SERVICE

                  '''
              }
            }
        }


    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
        success {
            echo 'Deployment successful.'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
