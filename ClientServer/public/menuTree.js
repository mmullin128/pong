
class MenuNode {
    constructor(doc,menuTree,parentNode,id,buttonNodes=[]) {
        this.doc = doc;
        this.menuNode = menuTree;
        this.parentNode = parentNode;
        this.id = id;
        this.buttonNodes = buttonNodes;
        console.log(id);
        this.element = doc.getElementById(id);
        if (this.element == null) {
            console.log("no element", id);
            this.element = doc.createElement("div");
            this.element.setAttribute("id",id);
            doc.append(this.element);
        }
    }
    find(id) { //finds buttons and menuNodes
        if (this.id == id) return this;
        for (let childNode of this.buttonNodes) {
            if (childNode.id == id) return childNode;
            const found = childNode.sendNode.find(id);
            if (found) return found
        }
        return 0;
    }
    render() {
        this.element.classList.add("showing");
        this.element.classList.remove("hidden");
    }
    derender() {
        this.element.classList.remove("showing");
        this.element.classList.add("hidden");
    }
}

class ButtonNode extends MenuNode {
    constructor(doc,menuTree,id,parentNode,sendNode) {
        super(doc,menuTree,id);
        this.parentNode = parentNode;
        this.sendNode = sendNode;
        //add event listeners to send menuTree to sendNode
        this.element.addEventListener("click", (event) => {
            //this.menuTree.next(this.sendNode);
        });

    }
}

export class MenuTree {
    constructor(doc) {
        this.doc = doc;
        this.menuNodes = [];
        this.focus = null;
        const menuElements = doc.querySelectorAll("div.menu");
        //create all menu nodes first
        for (let i=0; i<menuElements.length; i++) {
            console.log(i,menuElements.length);
            console.log("tpye:", menuElements[i]);
            console.log(menuElements[i].id);
            let menuNode = new MenuNode(doc,this,null,menuElements[i].id);
            this.menuNodes.push( menuNode );
        }
        //then add buttons with paths to menu nodes
        for (let i=0; i<this.menuNodes.length; i++) {
            const menuNode = this.menuNodes[i];
            const buttonElements = menuNode.element.getElementsByTagName("button");
            for (let j=0; j<buttonElements.length; j++) {
                const buttonElement = buttonElements[j];
                const sendNode = this.find(buttonElement.getAttribute("send"));
                const buttonNode = new ButtonNode(doc,this,buttonElements[j].id,menuNode,sendNode);
                menuNode.buttonNodes.push(buttonNode);
            }
        }
    }
    find(id) {
        let found = 0;
        for (let menuNode of this.menuNodes) {
            found = menuNode.find(id);
            if (found) return found;
        }
        return found;
    }
    next(menuNode) {

    } 
}
