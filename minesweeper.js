function main() {
    createElements();

    newGame();
}

/**
 * Creates html elements of the page
 */
function createElements() {
    /**
     * A helper function to create an element in a single line.
     * @param tagName
     * @param className
     * @param id
     * @returns {Element}
     */
    function newElement(tagName, className, id) {
        let element = document.createElement(tagName);
        if (className)
            element.className = className;
        if (id)
            element.id = id;

        return element;
    }

    /**
     * Creates a div element having the given class and id.
     * @param className
     * @param id
     * @returns {Element}
     */
    function newDiv(className, id) {
        return newElement('div', className, id);
    }

    //Alert modal div
    let alertModalDiv = newDiv('modal', 'alert-modal');
    document.body.appendChild(alertModalDiv);

    let alertChildDiv = newDiv('modal-content');
    alertModalDiv.appendChild(alertChildDiv);

    let name = newElement('input', 'field', 'name');
    name.placeholder = 'Enter your name';
    alertChildDiv.appendChild(name);

    let okBtn = newElement('button');
    okBtn.innerHTML = 'OK';
    alertChildDiv.appendChild(okBtn);
    //Alert modal div - END

    let windowDiv = newDiv('window');
    document.body.appendChild(windowDiv);

    //Title bar div
    let titleBarDiv = newDiv('title-bar');
    windowDiv.appendChild(titleBarDiv);

    let gameTitleSpn = newElement('span', null, 'game-title');
    gameTitleSpn.innerHTML = 'Minesweeper Online - Beginner!';
    titleBarDiv.appendChild(gameTitleSpn);

    let titleChildDiv = newDiv();
    titleBarDiv.appendChild(titleChildDiv);

    let minimizeBtnSpn = newElement('span', 'btn', 'btn-minimize');
    titleChildDiv.appendChild(minimizeBtnSpn);

    let closeBtnSpn = newElement('span', 'btn', 'btn-close');
    titleChildDiv.appendChild(closeBtnSpn);
    //Title bar div - END

    //Top panel div
    let topDiv = newDiv('top');
    windowDiv.appendChild(topDiv);

    let counterSpn = newElement('span', 'counter');
    counterSpn.innerHTML = '123';
    topDiv.appendChild(counterSpn);

    let smileSpn = newElement('span', 'smile');
    smileSpn.setAttribute('data-value', 'normal');
    topDiv.appendChild(smileSpn);
    smileSpn.onclick = function () {
        newGame();
    };

    let counterSpn2 = newElement('span', 'counter');
    counterSpn2.innerHTML = '321';
    topDiv.appendChild(counterSpn2);
    //Top panel div - END

    getGameXML((str) => {
        var oParser = new DOMParser();
        var oDOM = oParser.parseFromString(str, "text/xml");
        let gameElement = oDOM.documentElement;
        if (gameElement.id !== 'minesweeper') {
            alert('Wrong data received from the server.');
            return;
        }

        let game = {
            id: gameElement.getAttribute('id'),
            title: gameElement.getAttribute('title'),
            defaultLevel: gameElement.getElementsByTagName('levels')[0].getAttribute('default'),
            levels: []
        };

        for (let level of gameElement.getElementsByTagName('levels')[0].children) {
            game.levels.push({
                id: level.getAttribute('id'),
                title: level.getAttribute('title'),
                timer: level.getAttribute('timer') === "true",
                rows: level.getElementsByTagName('rows')[0].innerHTML,
                cols: level.getElementsByTagName('cols')[0].innerHTML,
                mines: level.getElementsByTagName('mines')[0].innerHTML,
                time: level.getElementsByTagName('time')[0].innerHTML
            })
        }
    });
}

function newGame() {
    /**
     * Loads an xml file.
     * @param filename The path to the file
     * @returns {Document} xml content.
     */
    function loadXMLDoc(filename) {
        if (window.ActiveXObject) {
            xhttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        else {
            xhttp = new XMLHttpRequest();
        }
        xhttp.open("GET", filename, false);
        try {
            xhttp.responseType = "msxml-document"
        } catch (err) {
        } // Helping IE11
        xhttp.send("");
        return xhttp.responseXML;
    }

    /**
     * Transforms the xml to an html element using the given xsl.
     * @param xml
     * @param xsl
     * @returns {*} The processed html element.
     */
    function getHtmlElement(xml, xsl) {
        // code for IE
        if (window.ActiveXObject || xhttp.responseType == "msxml-document") {
            return xml.transformNode(xsl);
        }
        // code for Chrome, Firefox, Opera, etc.
        else if (document.implementation && document.implementation.createDocument) {
            xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsl);
            return xsltProcessor.transformToFragment(xml, document);
        }
    }


    getNewGame('<Request><rows>9</rows><cols>9</cols><mines>10</mines></Request>', (xmlStr) => {
        let levelDOM = new DOMParser().parseFromString(xmlStr, "text/xml");
        let grid = getHtmlElement(levelDOM, loadXMLDoc("./schema/level-style.xsl"));
        grid.id = 'grid';
        document.getElementsByClassName('window')[0].appendChild(grid);
    });
}

main();

