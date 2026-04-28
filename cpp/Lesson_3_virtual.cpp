#include<iostream>
#include<cstring>
using namespace std;

class Entity{
public:
    virtual string GetName(){ return "Entity"; }
};

class Player:public Entity{
private:
    string m_Name;
public:
    Player(const string& name):m_Name(name){}

    string GetName(){ return m_Name ;}
};

int main(){
    cout<<"今天学习 虚函数"<<endl;

    //虚函数的意义就是在于修改由父类 统一管理的成员函数
    //关键字：virtual（虚拟的，虚函数） 用于修饰父类的重载成员函数

    Entity* e = new Entity();
    cout<< e->GetName() <<endl;

    Entity* p = new Player("Jalen");
    //在这里 我们用父类的类型变量去接收我们的子类指针 用父类指针去统一管理
    //在c++当中 我们称之为 多态 ，意味着我们不用每一个子类都去设一个对应的类型
    cout<< p->GetName() <<endl;
    //在这里 我们因为用父类去统一管理 所以当我们子类要去修改父类重载的函数 系统无法识别
    //所以就用的到我么今天的知识点 虚函数

    //virtual string GetName(){ return "Entity"; }
    //在overload的成员函数前面加上virtual 虚函数 就可以自己识别子类overload了的成员函数
    
    return 0;
}