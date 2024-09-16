/*!
 * Author: Albresky
 * Date: 2024/09/16
 * Description: Core scripts for BUPT-Course-Killer
 */

class Killer {
    constructor(document) {
        this.document = document;

    }
    static course_cnt = 0;
    static course_sel_all = [];
    static course_dialogs_all = [];

    rewriteOnClick(sel, my_id){
        if (sel == null){
            console.log(`Error: ${sel} is null`);
            return;
        }
        let original_event = sel.getAttribute("onclick");
        let new_event = original_event.replace(/'selClass'/, `'selClass_${my_id}'`);
        sel.attributes.removeNamedItem("onclick");
        sel.setAttribute("onclick", new_event);
    }
    
    getSelkc(chkbox){
        let cur_tr = chkbox.parentNode.parentNode;
        if (cur_tr == null){
            console.log(`Error: cur_tr of ${chkbox} is null`);
            return null;
        }
        let cur_td = cur_tr.querySelectorAll("td");
    
        // the course selection id is 8th column
        let selkc = cur_td[7];
        if (selkc == null){
            console.log(`Error: selkc of ${chkbox} is null`);
            return null;
        }
        if(selkc.children.length == 0){
            console.log(`Error: selkc of ${chkbox} is empty`);
            return null;
        }
        selkc = selkc.children[0];
        return selkc;
    }
    
    onCourseCheck(chkbox){
        let selkc = this.getSelkc(chkbox);
        if (selkc == null){
            console.log(`Error: selkc of ${chkbox} is null`);
            return;
        }
        if(Killer.course_sel_all.includes(selkc)){
            //remove from list
            let index = Killer.course_sel_all.indexOf(selkc);
            Killer.course_sel_all.splice(index, 1);
            console.log(`Remove ${selkc} from list`);
        }else{
            //add to list
            Killer.course_sel_all.push(selkc);
            console.log(`Add ${selkc} to list`);
        }
    }

    addColumnHeader() {
        let headerRow = this.document.querySelector(".Grid_Line tr");
        let newHeader = this.document.createElement("th");
        newHeader.setAttribute("align", "center");
        newHeader.setAttribute("scope", "col");
        newHeader.setAttribute("style", "width:25px;white-space:nowrap;");
        newHeader.textContent = "抢课";
        headerRow.appendChild(newHeader);
    };
    
    addCheckboxToRows() {
        let rows = this.document.querySelectorAll(".Grid_Line tbody tr");
    
        rows.forEach((row, index) => {
            if (index > 0) { // Skip the header row
                let newCell = this.document.createElement("td");
                newCell.setAttribute("align", "center");
                newCell.setAttribute("style", "white-space:nowrap;");
                newCell.setAttribute("bgcolor", "#FFFFFF");
    
                let checkbox = this.document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("id", "contentParent_dgData_kill_" + index);
                checkbox.setAttribute("class", "none");
                checkbox.setAttribute("style", "color:Black;");
    
                newCell.appendChild(checkbox);
                row.appendChild(newCell);
    
                // add event listener if checkbox is checked
                checkbox.addEventListener("change", ()=> {
                    this.onCourseCheck(checkbox);
                });
    
                // rewrite onclick event on the course selection
                let selkc = this.getSelkc(checkbox);
                if (selkc == null){
                    console.log(`Error: selkc of ${checkbox} is null`);
                    return;
                }
                this.rewriteOnClick(selkc, index);
    
                // save info
                Killer.course_cnt++;
            }
        });
    }
    
    openDialogs(){
        Killer.course_sel_all.forEach((selkc, index) => {
            selkc.click();
        });
    
        let frames = this.document.querySelectorAll('iframe[name^="selClass_"]');
        frames.forEach((frame, index) => {
            Killer.course_dialogs_all.push(frame);
        });
    
    }
    
    closeDialog(frame) {
        if(frame == null){
            console.log(`Error: frame is null`);
            return;
        }
        try{
            frame.parentNode.parentNode.parentNode.parentNode.querySelector('.ui_close').click();
        }
        catch(err){
            console.log(`Error: ${err}`);
        }
    }

    waitForAllIframesLoad(iframes, callback) {
        let loadedCount = 0;
        const totalIframes = iframes.length;
        
        if (totalIframes === 0) {
            console.log('No iframes to wait for');
            return;
        }
    
        iframes.forEach(function(iframe) {
            iframe.addEventListener('load', function() {
                loadedCount++;
                console.log(`iframe loaded: ${loadedCount}`);
                if (loadedCount === totalIframes) {
                    callback();
                }
            });
        });
    }


    chooseOneCourse(frame) {
        try {
            if (frame.contentDocument) {
                let btn = frame.contentDocument.querySelector('.l-btn-left');
                if (btn) {
                    btn.parentNode.click();
                } else {
                    console.log('Error: .l-btn-left not found');
                }
            } else {
                console.log('Error: frame.contentDocument is null');
            }
        } catch (err) {
            console.log(`Error: chooseOneCourse: ${err}`);
        }
    }

    chooseAllCourses(frames) {
        frames.forEach((frame, index) => {
            this.chooseOneCourse(frame);
        });
    }

    startKill(){
        if(Killer.course_sel_all.length == 0){
            console.log('Error: No courses selected');
            alert('请先在 [抢课] 栏目勾选课程');
            return;
        }
        this.openDialogs();
        this.waitForAllIframesLoad(Killer.course_dialogs_all, this.chooseAllCourses(Killer.course_dialogs_all));
    }

    initKillButton() {
        let killButton  = this.document.createElement("a");
        killButton.setAttribute("id", "hykKill");
        killButton.setAttribute("onclick", "killer.startKill()");
        killButton.setAttribute("href", "javascript:void(0)");
        killButton.setAttribute("class", "l-btn l-btn-small l-btn-plain");
        killButton.setAttribute("group", "");
        killButton.innerHTML = '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">开始抢课</span><span class="l-btn-icon icon-tip">&nbsp;</span></span>';

        let infoBtn = document.querySelector('.formTop #hykHelp');
        try{
            infoBtn.parentNode.insertBefore(killButton, infoBtn);
        }
        catch(err){
            console.log(`Error: initKillButton: ${err}`);
        }
    }
}

window.onload = function() {
    window.killer = new Killer(document);
    killer.addColumnHeader();
    killer.addCheckboxToRows();
    killer.initKillButton();
    killer.openDialogs();
};

