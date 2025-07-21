pipeline {
    agent any

    environment{
        APP_NAME = 'food-website'
        AWS_DEFAULT_REGION = 'ap-southeast-2'
    }

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                '''
            }
        }

        stage('Deploy to AWS'){
            agent{
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
                    LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition.json)
                    echo $LATEST_TD_REVISION
                    aws ecs update-service --cluster my_order_app --service food-website-service --task-definition order-web:$LATEST_TD_REVISION
                  '''
              }
            }
        }


    }
}
