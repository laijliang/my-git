#include<iostream>
#include<string>
using namespace std;

struct Vector2{
    float x,y;

    Vector2(float x,float y):x(x),y(y){}

    Vector2 Add(const Vector2& other){//这种不太好读 所以就要用我们今天学的运算符重载
        return Vector2( x + other.x , y + other.y);
    }

    Vector2 operator+(const Vector2& other){//Add
        x += other.x;
        y += other.y;
        return *this;
    }

    Vector2 operator*(const Vector2& other){//Multiply
        x *= other.x;
        y *= other.y;
        return *this;
    }

    void Print(){
        cout<<x<<" "<<y<<endl;
    }
};

int main(){
    Vector2 position(4.0,4.0);
    Vector2 speed(0.5,1.5);
    Vector2 powerup(2.0,2.0);
    
    Vector2 result_1 = position.Add(speed);
    Vector2 result_2 = position + speed ;

    result_1.Print();//4.5 5.5
    result_2.Print();//4.5 5.5 于上面的这个一致，所以运算符重载 可以提升代码的可读性 和 重复利用发性

    //同样的 我们可以利用operator 关键字去和其他的运算符去overload
    //例如： + - = * / 还有很多很多

    Vector2 result_3 = position + speed * powerup;
    //注意: 运算符重载意味着重新定义了这个符号在类成员之间的意义 
    //      本质是因为这些运算符在对象之间传递的不能是 类 类型的内容
    //      运算符重载其实就是函数的另一种表达形式
    //      但是要保留运算符原本的 优先级

    result_3.Print();//5.5 8.5

    return 0;
}