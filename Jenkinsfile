pipeline{
    agent any

    stages{
        stage('build'){
            steps{
              sh 'yarn'      
              sh 'yarn build'      
            }
        }
        
        stage('test'){
            steps{
                sh 'yarn test'
            }
        }
    }
}
