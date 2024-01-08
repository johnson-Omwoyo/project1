#include <iostream>
#include <cstdlib>
#include <ctime>
int compare(int guess,int num);
using namespace std;
main(){

    int guess,num;
    srand(time(0));
    num=rand();
    cout<<"enter your guess";
    cin>>guess;
    compare(guess,num);
}
int compare(int guess,int num){

    if (guess<num)
{
    cout<<"guess was too low try another chance";

}else if (guess>num){
    cout <<"guess was too high try another chance";
}else{cout<<"correct!";}return 0;}
