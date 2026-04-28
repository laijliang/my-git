#include<iostream>
#include<cstring>

using namespace std;

class Person{
private:
    string name;
    int age;
    bool isMale;
public:
    Person(string name,int age,bool isMale)
    :name(name),age(age),isMale(isMale){}
    
    string getName() const { return name; }

    int getAge() const { return age; }

    bool getIsMale() const { return isMale; }

};

class Student : public Person{
private:
    string school;
    int id;
public:
    Student(string name,int age,bool isMale,string school,int id)
    :Person(name,age,isMale),school(school),id(id){}

    string getSchool() const { return school; }

    int getId() const { return id; }

    void PrintInfo() const {
        cout << "Name: " << getName() << endl;
        cout << "Age: " << getAge() << endl;
        cout << "Sex: " << (getIsMale() ? "Male" : "Female") << endl;
        cout << "School: " << getSchool() << endl;
        cout << "ID: " << getId() << endl;
    }
};

int main(){
    Student student("Jalen",18,true,"SYSU",12345);
    student.PrintInfo();
    return 0;
}