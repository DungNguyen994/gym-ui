pipeline{
    agent any
    tools{
        nodejs "Node"
    }
    stages{
        stage('Building'){
            steps{
                sh 'yarn'      
            }
        }
        stage('Testing'){ 
            steps{
              sh "yarn test"
            }
        }
        stage('Docker Build'){ 
            steps{
              sh "docker build -t gym-ui ."
            }
        }
        stage('Docker Push'){ 
            steps{
                script{
                    withCredentials([string(credentialsId: 'docker-hub-pwd', variable: 'dockerhubpwd')]){
                        sh 'docker login -u dungnguyen94 -p ${dockerhubpwd}'
                    }
                    sh "docker push gym-ui"
                }
            }
        }
    }
}
