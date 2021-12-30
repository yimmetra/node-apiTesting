//javaScript Builder pat

class Books {
    constructor(name) {
        this.name=name;
    }

}

class BookBuilder{
    constructor(name) {
        this.book=new Books(name)
    }
    setType(type){
        if(typeof type=='undefined'){

        }
        else {
            this.book.type=type;
            return this;
        }

    }
    setPrice(price){
        this.book.price=price;
        return this;
    }
    build(){
        return this.book;
    }
}

export {BookBuilder}