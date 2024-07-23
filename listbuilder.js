const keys = new Set();
const fs = require('fs');

const file = fs.createWriteStream(__dirname + `/form_list.xml`, {
    'flags': 'a',
    'encoding': 'utf8',     
});

createDropdownList('My List', 'list1.txt', 'cons', false, false);


function createDropdownList(label, list, tag="cons", global=false, required=false, width="350") {
    let list_items = generateListItems(list);
    // Create unique key
    let key = generatekey();
    keys.add(key);
    let content = `<list label="${label}" key="${key}" code="${key}" global="${global}" tag="${tag}" width="${width}" required="${required}">
            <item></item>
            ${list_items}
        </list>`;
    
    file.write(content + '\r\n', (error) => {
            if(error) {
            return console.log(error.message)
            };
    });
    
    return content;
};

function generateListItems(items) {
    let list = ``;
    let content_arr;
    let list_items = [];
    
    if(typeof items === 'string') {
        let content = fs.readFileSync(__dirname + `/${items}`, 'utf8');
        content_arr = content.split('\n');
    }
    else { 
        content_arr = items;
    };
    content_arr.forEach((value) => {
        // Encode instances of '&' so it's valid XML
        let encoded_value = value.toString().replace(/&/g, '&amp;');
        
        let key = generatekey();
        let li = `<item key="${key}" code="${key}">${encoded_value.trim()}</item>`;
        list_items.push(li);
    });
    for(item in list_items) {
        list += list_items[item] + '\r\n';
    };
    return list;
};

function generatekey() {
    let key;
    do {
        key = Math.floor(Math.random() * 90000 + 5000).toString();
    } while (keys.has(key));
    return key;
};