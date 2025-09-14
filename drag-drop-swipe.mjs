// drag-drop-swipe.mjs
// A minimal drag, drop, and swipe module
// Author: Vaibhav Jain (https://github.com/v-aibha-v-jain)


// drag-drop-swipe.mjs
// Flexible drag, drop, and swipe module


const DragDropSwipe = {
    /**
         * Initialize drag, drop, and swipe functionality.
         * @param {Object} options
         * @param {string} options.draggableSelector - Selector for draggable elements.
         * @param {string} [options.droppableSelector] - Selector for drop targets (default: document).
         * @param {string} [options.disposeSelector] - Selector for dispose/trash area (optional).
         * @param {function} [options.onDragStart] - Callback for drag start.
         * @param {Number} [options.SwipeThreshold] - Threshold for swipe detection (default: 7).
    */
    init({
        draggableSelector = '.draggable',
        droppableSelector = null,
        disposeSelector = null,
        onDragStart = () => {},
        gridSize = { cols: 6, rows: 4 },
        SwipeThreshold = 7,
    } = {}) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const draggables = document.querySelectorAll(draggableSelector);
        const droppables = droppableSelector ? document.querySelector(droppableSelector) : [document];
        const disposeArea = disposeSelector ? document.querySelector(disposeSelector) : null;
        let dragImage = null;
        let dragShadow = null;
        let isFromLibrary = false;
        let droppedImages = [];
        let noCollide = true;
        let imgCnt = 0;
        let adjustedX = 0, adjustedY = 0;
        let stoploop = true;
        let count_drag = new Array(gridSize.cols * gridSize.rows).fill(0);
        let imbeentouched = false;
        let plate_inchs_l_h = [gridSize.cols, gridSize.rows];
        let before_drag = [0, 0];
        function setupDraggable(div) {
        div.draggable = true;
        if (!isIOS) {
            if (div.parentElement === droppables) {
                div.ondragstart = (ev) => {
                    onDragStart(ev, false);
                };
            } else {
                div.ondragstart = (ev) => {
                    onDragStart(ev, true);
                };
            }
        } else {
            div.style.touchAction = 'none';
        }
        div.dropable = false;
        }
        draggables.forEach(setupDraggable);
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches && node.matches(draggableSelector)) {
                        setupDraggable(node);
                    }
                    if (node.nodeType === 1 && node.querySelectorAll) {
                        node.querySelectorAll(draggableSelector).forEach(setupDraggable);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        function onDragStart(ev, fromLibrary = false) {
            dragImage = fromLibrary ? ev.target.cloneNode(true) : ev.target;
            dragImage.style.opacity = "0.5";
            isFromLibrary = fromLibrary;
            createDragShadow(ev);
            ev.dataTransfer.effectAllowed = "copy";
        }
        function createDragShadow(ev) {
            const existingShadow = document.querySelector('.thisisadraggingshadow');
            if (existingShadow) {
                existingShadow.remove();
            }
            dragShadow = dragImage.cloneNode(true);
            dragShadow.style.position = "fixed";
            dragShadow.classList.add("thisisadraggingshadow");
            dragShadow.style.opacity = "0";
            dragShadow.style.pointerEvents = "none";
            dragShadow.style.transform = "none";
            const dataW = parseInt(dragImage.getAttribute('data-w')) || 1;
            const dataH = parseInt(dragImage.getAttribute('data-h')) || 1;
            const gridW = droppables.offsetWidth / plate_inchs_l_h[0];
            const gridH = droppables.offsetHeight / plate_inchs_l_h[1];
            dragShadow.style.width = (gridW * dataW) + "px";
            dragShadow.style.height = (gridH * dataH) + "px";
            document.body.appendChild(dragShadow);
            updateShadowPosition(ev);
        }
        function updateShadowPosition(ev) {
            if(!dragShadow){
                const shadowElements = document.getElementsByClassName("thisisadraggingshadow");
                if (shadowElements.length > 0) {
                    dragShadow = shadowElements[0];
                }
            }
            if (dragShadow && dragShadow.style) {
                dragShadow.style.left = ev.clientX - (dragShadow.offsetWidth / 2) + "px";
                dragShadow.style.top = ev.clientY - (dragShadow.offsetHeight / 2) + "px";
            }
        }
        function dragOver(ev) {
            ev.preventDefault();
            if (!dragShadow) {
                const existingShadow = document.querySelector('.thisisadraggingshadow');
                if (existingShadow) {
                    dragShadow = existingShadow;
                } else if (dragImage) {
                    createDragShadow(ev);
                }
            }
            updateShadowPosition(ev);
            if (ev.clientY < 50) {
                window.scrollBy({
                    top: -20,
                    behavior: 'smooth'
                });
            }
            if(stoploop && !imbeentouched){
                let whiteboard = droppables.getElementsByTagName('div');
                for (let i = 0; i < whiteboard.length; i++) {
                    const div = whiteboard[i];
                    if (div !== dragImage) {
                        swipe(div, ev, i);
                    }
                }
            }
        }
        document.addEventListener('dragover', dragOver);
        function swipe(div, ev, i) {
            if (!dragImage) return;
            const rect = div.getBoundingClientRect();
            let dragImageLineClasses = [];
            let xofdi = (ev.clientY - droppables.getBoundingClientRect().top);
            for (let j = 0; j < plate_inchs_l_h[1]; j++) {
                const start = j * (droppables.offsetHeight / plate_inchs_l_h[1]);
                const end = (j + 1) * (droppables.offsetHeight / plate_inchs_l_h[1]);
                if (xofdi > start && xofdi < end) {
                    dragImageLineClasses.push(`line${j + 1}`);
                }
            }
            const divLineClasses = Array.from(div.classList).filter(cls => /^line\d+$/.test(cls));
            const sharesLine = dragImageLineClasses.some(lineClass => divLineClasses.includes(lineClass));
            if (!sharesLine) return;
            stoploop = false;
            let dragimagewidth;
            if(dragImage.offsetWidth === 0){
                dragimagewidth = removepx(dragImage.style.width);
            }else dragimagewidth = dragImage.offsetWidth;
            let overlapX = ev.clientX + (dragimagewidth / 2) > rect.left && ev.clientX - (dragimagewidth / 2) < rect.left + div.offsetWidth;
            let overlapY = ev.clientY > rect.top && ev.clientY < rect.top + div.offsetHeight;
            if (overlapX && overlapY) {
                if(isIOS){
                    if (Math.abs(before_drag[0] - ev.clientX) <= 12 && Math.abs(before_drag[1] - ev.clientY) <= 12) {
                        count_drag[i]++;
                    }
                }else if (before_drag[0] == ev.clientX && before_drag[1] === ev.clientY) {
                    count_drag[i]++;
                }
                if (count_drag[i] > SwipeThreshold) {
                    count_drag.fill(0);
                    if (ev.clientX > rect.left + (div.offsetWidth / 2)) {
                        let can_swipe = swipe_collision(removepx(div.style.left)-(100/plate_inchs_l_h[0]), removepx(div.style.top), div, -1);
                        if(removepx(div.style.left) - (100/plate_inchs_l_h[0]) >= -0.5 && !can_swipe){
                            div.style.left = removepx(div.style.left) - (100/plate_inchs_l_h[0]) + "%";
                            updateColumnClasses(div, -1);
                        }
                    }
                    if (ev.clientX < rect.left + (div.offsetWidth / 2)) {
                        let can_swipe = swipe_collision(removepx(div.style.left)+(100/plate_inchs_l_h[0]), removepx(div.style.top), div, 1);
                        if((removepx(div.style.left) + (100/plate_inchs_l_h[0]) + ((removepx(div.style.width)*100)/droppables.offsetWidth) < 101) && !can_swipe){
                            div.style.left = removepx(div.style.left) + (100/plate_inchs_l_h[0]) + "%";
                            updateColumnClasses(div, 1);
                        }
                    }
                }
                before_drag[0] = ev.clientX;
                before_drag[1] = ev.clientY;
            } else {
                count_drag[i] = 0;
                overlapX = false;
                overlapY = false;
            }
            stoploop = true;
        }
        function updateColumnClasses(img, direction) {
            const columnClasses = Array.from(img.classList)
                .filter(cls => /^column\d+$/.test(cls));
            const columnNumbers = columnClasses.map(cls => parseInt(cls.replace('column', ''), 10));
            columnClasses.forEach(cls => img.classList.remove(cls));
            if (columnNumbers.length === 0) return;
            const minCol = Math.min(...columnNumbers);
            const maxCol = Math.max(...columnNumbers);
            if (direction === -1) {
                if (minCol > 1) {
                    for (let col = minCol - 1; col < maxCol; col++) {
                        img.classList.add(`column${col}`);
                    }
                }
            } else if (direction === 1) {
                const maxColAllowed = plate_inchs_l_h[0];
                if (maxCol < maxColAllowed) {
                    for (let col = minCol + 1; col <= maxCol + 1; col++) {
                        img.classList.add(`column${col}`);
                    }
                }
            }
        }
        function swipe_collision(x, y, img, direction) {
            if (x < -5 || 5 + x + img.offsetWidth > droppables.offsetWidth) return true;
            const whiteboard = Array.from(droppables.getElementsByTagName('div'));
            const imgLineClasses = Array.from(img.classList).filter(cls => /^line\d+$/.test(cls));
            if (imgLineClasses.length === 0) return false;
            const imgColumnClasses = Array.from(img.classList).filter(cls => /^column\d+$/.test(cls));
            const imgColumnNumbers = imgColumnClasses.map(cls => parseInt(cls.replace('column', ''), 10));
            let targetColumn;
            if (direction === 1) {
                targetColumn = Math.max(...imgColumnNumbers) + 1;
            } else if (direction === -1) {
                targetColumn = Math.min(...imgColumnNumbers) - 1;
            }
            if (!targetColumn || targetColumn < 1) return false;
            const targetColumnClass = `column${targetColumn}`;
            let blocked = false;
            for (const lineClass of imgLineClasses) {
                const sameLineDivs = whiteboard.filter(div =>
                    div !== img &&
                    div !== dragImage &&
                    div.classList.contains(lineClass)
                );
                const targetDiv = sameLineDivs.find(div => div.classList.contains(targetColumnClass));
                if (targetDiv) {
                    blocked = checkRecursivePush(targetDiv, direction) || blocked;
                }
            }
            return blocked;
        }
        function checkRecursivePush(img, direction){
            const whiteboard = Array.from(droppables.getElementsByTagName('div'));
            const imgLineClasses = Array.from(img.classList).filter(cls => /^line\d+$/.test(cls));
            if (imgLineClasses.length === 0) return true;
            const imgColumnClasses = Array.from(img.classList).filter(cls => /^column\d+$/.test(cls));
            if (imgColumnClasses.length === 0) return true;
            const imgColumnNumbers = imgColumnClasses.map(cls => parseInt(cls.replace('column', ''), 10));
            let targetColumn;
            if (direction === 1) {
                targetColumn = Math.max(...imgColumnNumbers) + 1;
            } else if (direction === -1) {
                targetColumn = Math.min(...imgColumnNumbers) - 1;
            } else {
                return false;
            }
            const targetColumnClass = `column${targetColumn}`;
            for (const lineClass of imgLineClasses) {
                const sameLineDivs = whiteboard.filter(div =>
                    div !== img &&
                    div !== dragImage &&
                    div.classList.contains(lineClass)
                );
                const targetDiv = sameLineDivs.find(div => div.classList.contains(targetColumnClass));
                if (targetDiv) {
                    const blocked = checkRecursivePush(targetDiv, direction);
                    if (blocked) return true;
                }
            }
            const imgLeftPx = ((removepx(img.style.left) / 100) * droppables.offsetWidth) + (direction * (100 / plate_inchs_l_h[0]));
            const imgRightPx = imgLeftPx + img.offsetWidth;
            if (imgRightPx > droppables.offsetWidth || imgLeftPx < 0) {
                return true;
            }
            img.style.left = removepx(img.style.left) + (direction * (100 / plate_inchs_l_h[0])) + "%";
            updateColumnClasses(img, direction);
            return false;
        }
        function drop(ev) {
            ev.preventDefault();
            if (!dragImage) return;
            const dropBounds = droppables.getBoundingClientRect();
            adjustedX = ev.clientX - dropBounds.left - (dragShadow.offsetWidth / 2);
            for (let ii = 0; ii < droppables.offsetHeight - 1; ii = ii + (droppables.offsetHeight / plate_inchs_l_h[1])) {
                if (ev.clientY - dropBounds.y > ii && ev.clientY - dropBounds.y < ii + (droppables.offsetHeight / plate_inchs_l_h[1])) {
                    adjustedY = ii; break;
                }
            }
            for (let jj = 0; jj < droppables.offsetWidth - 1; jj += (droppables.offsetWidth / plate_inchs_l_h[0])) {
                const segmentWidth = dragShadow.offsetWidth > (droppables.offsetWidth / plate_inchs_l_h[0]) 
                    ? (droppables.offsetWidth / plate_inchs_l_h[0]) * 2 
                    : (droppables.offsetWidth / plate_inchs_l_h[0]);
                if (ev.clientX - dropBounds.x > jj && ev.clientX - dropBounds.x < jj + segmentWidth) {
                    adjustedX = jj; break;
                }
            }
            if (adjustedX < 0) adjustedX = 0;
            if (adjustedY < 0) adjustedY = 0;
            if (adjustedX + dragShadow.offsetWidth > dropBounds.width) {
                adjustedX = dropBounds.width - dragShadow.offsetWidth;
            }
            if (adjustedY + dragShadow.offsetHeight > dropBounds.height) {
                adjustedY = dropBounds.height - dragShadow.offsetHeight;
            }
            const whiteboardDivs = Array.from(droppables.getElementsByTagName('div'));
            for(let i = 0; i < whiteboardDivs.length; i++) {
                if(whiteboardDivs[i] != dragImage) noCollide = collisionCheck(whiteboardDivs[i], adjustedX, adjustedY);
                if (!noCollide) break;
            }
            if (!noCollide) adjustElementsPositions();
            if (droppables.contains(ev.target) && noCollide) {
                dragImage.style.position = "absolute";
                const relativeX = (adjustedX / dropBounds.width) * 100;
                const relativeY = (adjustedY / dropBounds.height) * 100;
                dragImage.style.left = relativeX + "%";
                dragImage.style.top = relativeY + "%";
                if (isFromLibrary) {
                const dataW = parseInt(dragImage.getAttribute('data-w')) || 1;
                const dataH = parseInt(dragImage.getAttribute('data-h')) || 1;
                const gridW = droppables.offsetWidth / plate_inchs_l_h[0];
                const gridH = droppables.offsetHeight / plate_inchs_l_h[1];
                dragImage.style.width = (gridW * dataW) + "px";
                dragImage.style.height = (gridH * dataH) + "px";
                dragImage.className = dragImage.className + " " + imgCnt; imgCnt++;
                droppables.appendChild(dragImage);
                droppedImages.push({ element: dragImage, relativeX, relativeY });
                isFromLibrary = false;
                }
            }
            dragImage.classList.remove('line1', 'line2', 'line3', 'line4');
            let tempj = 1;
            for (let ii = 0; ii < plate_inchs_l_h[1]; ii++) {
                if(removepx(dragImage.style.top) < (ii*(100 / plate_inchs_l_h[1]) + ( ((ii+1)*(100 / plate_inchs_l_h[1])) - (ii*(100 / plate_inchs_l_h[1])) )/2 )){
                    let lineClass = `line${ii+1}`;
                    dragImage.classList.add(lineClass);
                    if(dragShadow.offsetHeight > 1.5*(droppables.offsetHeight / plate_inchs_l_h[1])) dragImage.classList.add(`line${tempj+1}`);
                    break;
                }
                tempj++;
            }
            for (let i = 1; i <= plate_inchs_l_h[0]; i++) {
                dragImage.classList.remove(`column${i}`);
            }
            for (let i = 1; i <= plate_inchs_l_h[0]; i++) {
                const colCenter = ((i - 1) + 0.5) * (droppables.offsetWidth / plate_inchs_l_h[0]);
                const imgLeft = (parseFloat(dragImage.style.left) / 100) * droppables.offsetWidth;
                const imgRight = imgLeft + dragImage.offsetWidth;
                if (colCenter >= imgLeft && colCenter <= imgRight) {
                dragImage.classList.add(`column${i}`);
                }
            }
            cleanupAfterDrop();
            const shadowDiv = document.querySelector('.thisisadraggingshadow');
            if (shadowDiv) shadowDiv.remove();
        }
        function adjustElementsPositions() {
            const whiteboard = Array.from(droppables.getElementsByTagName('div'));
            const step = (droppables.offsetWidth / plate_inchs_l_h[0]);
            let originalAdjustedX = adjustedX;
            for (let div of whiteboard) {
                if (div === dragShadow || div === dragImage) continue;
                let collisionSide = detectCollisionSide(div, adjustedX, adjustedY);
                if (collisionSide === "left" || collisionSide === "right") {
                    let adjusted = false;
                    if (collisionSide === "left") {
                        for (let i = 0; i < droppables.offsetWidth; i += step) {
                            adjusted = shiftLeft(step, div);
                            if (adjusted) break;
                        }
                    } else if (collisionSide === "right") {
                        for (let i = 0; i < droppables.offsetWidth; i += step) {
                            adjusted = shiftRight(step, div); 
                            if (adjusted) break;
                        }
                    }
                    if (adjusted && checkForSecondaryCollisions()) {
                        noCollide = true;
                        break;
                    } else {
                        adjustedX = originalAdjustedX; 
                        noCollide = false; 
                    }
                }
            }
        }
        document.addEventListener('drop', drop);
        function detectCollisionSide(div, x, y) {
            const rect = div.getBoundingClientRect();
            const dropBounds = droppables.getBoundingClientRect();
            const divX = rect.left - dropBounds.left;
            const overlapRight = x + dragShadow.offsetWidth > divX && x < divX;
            const overlapLeft = x < divX + div.offsetWidth && x + dragShadow.offsetWidth > divX + div.offsetWidth;
            if (overlapRight) return "left";
            if (overlapLeft) return "right";
            return null;
        }
        function shiftRight(step, div) {
            while (adjustedX + dragShadow.offsetWidth + step <= droppables.offsetWidth) {
                adjustedX += step;
                if (!collisionCheck_adjust(div, adjustedX, adjustedY)) return true;
            }
            return false;
        }
        function shiftLeft(step, div) {
            while (adjustedX - step >= 0) {
                adjustedX -= step;
                if (!collisionCheck_adjust(div, adjustedX, adjustedY)) return true;
            }
            return false;
        }
        function collisionCheck_adjust(div, x, y) {
            const rect = div.getBoundingClientRect();
            const dropBounds = droppables.getBoundingClientRect();
            const divX = rect.left - dropBounds.left;
            const divY = rect.top - dropBounds.top;
            return (
                x < divX + div.offsetWidth &&
                x + dragShadow.offsetWidth > divX &&
                y < divY + div.offsetHeight &&
                y + dragShadow.offsetHeight > divY
            );
        }
        function collisionCheck(div, x, y) {
            if (div === dragImage) return false;
            const rect = div.getBoundingClientRect();
            const dropBounds = droppables.getBoundingClientRect();
            const divX = rect.left - dropBounds.left;
            const divY = rect.top - dropBounds.top;
            return !(
                x < divX + div.offsetWidth - 2 &&
                x + dragShadow.offsetWidth > divX + 2 &&
                y < divY + div.offsetHeight - 1 &&
                y + dragShadow.offsetHeight > divY + 1
            );
        }
        function checkForSecondaryCollisions() {
            const whiteboard = Array.from(droppables.getElementsByTagName('div'));
            for (let div of whiteboard) {
                if (!(div == dragShadow || div == dragImage) && !collisionCheck(div, adjustedX, adjustedY)) {
                    return false;
                }
            }
            return true;
        }
        setInterval(() => {
            if (!droppables || !plate_inchs_l_h) return;
            const numCols = plate_inchs_l_h[0];
            const dropWidth = droppables.offsetWidth;
            Array.from(droppables.getElementsByTagName('div')).forEach(div => {
                for (let i = 1; i <= numCols; i++) {
                    div.classList.remove(`column${i}`);
                }
                const leftPct = removepx(div.style.left);
                const widthPct = div.offsetWidth / dropWidth * 100;
                for (let i = 1; i <= numCols; i++) {
                    const centerpx = (i - 0.5) * (100 / numCols);
                    if (leftPct < centerpx && leftPct + widthPct > centerpx) {
                        div.classList.add(`column${i}`);
                    }
                }
            });
        }, 5000);
        disposeArea.ondragover = (ev) => ev.preventDefault();
        if (disposeArea) {
            disposeArea.ondrop = (ev) => {
                dispose(ev);
            }
        }
        function dispose(ev) {
            ev.preventDefault();
            if (dragImage) {
                dragImage.remove();
                const index = droppedImages.findIndex(img => img.element === dragImage);
                if (index !== -1) droppedImages.splice(index, 1);
            }
            cleanupAfterDrop();
        }
        function cleanupAfterDrop() {
            if (dragShadow) {
                dragShadow.remove();
                dragShadow = null;
            }
            const orphanedShadows = document.querySelectorAll('.thisisadraggingshadow');
            orphanedShadows.forEach(shadow => shadow.remove());
            if (dragImage) {
                dragImage.style.opacity = "1";
                dragImage = null;
            }
            noCollide = true;
        }
        document.addEventListener('dragend', cleanupAfterDrop);
        function removepx(value){
            if (value.endsWith('%')) {
                return parseFloat(value.slice(0, -1));
            }
            return parseInt(value.slice(0, -2));
        }
        let isTouchDragging = false;
        let touchStartElement = null;
        let touchOffset = { x: 0, y: 0 };
        if(isIOS){
            draggables.forEach(el => {
                el.style.removeProperty('overflow');
                el.style.removeProperty('scroll-behavior');
                el.style.removeProperty('-webkit-overflow-scrolling');
                el.style.removeProperty('touch-action');
                el.style.removeProperty('scrollbar-width');
                el.style.removeProperty('scrollbar-color');
            });
            document.addEventListener('touchstart', function(e) {
                const target = e.target;
                if (![...draggables].includes(target)) {
                    return;
                }
                touchStartElement = target;
                isTouchDragging = true;
                isFromLibrary = !droppables.contains(target);
                const rect = target.getBoundingClientRect();
                touchOffset.x = e.touches[0].clientX - rect.left;
                touchOffset.y = e.touches[0].clientY - rect.top;
                dragImage = isFromLibrary ? target.cloneNode(true) : target;
                if (target.parentElement && target.parentElement === droppables) {
                    target.style.opacity = "0.5";
                }
                e.preventDefault();
            }, { passive: false });
            document.addEventListener('touchmove', (e) => {
                if (isTouchDragging && touchStartElement) {
                    e.preventDefault();
                    const touch = e.touches[0];
                    if (!dragShadow) {
                        createDragShadow({ clientX: touch.clientX, clientY: touch.clientY });
                    }
                    if (dragShadow) {
                        updateShadowPosition({ clientX: touch.clientX, clientY: touch.clientY });
                    }
                    let whiteboard = droppables.getElementsByTagName('div');
                    const normalizedEvent = {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                    };
                    for (let i = 0; i < whiteboard.length; i++) {
                        const div = whiteboard[i];
                        if (div !== dragImage) {
                            swipe(div, normalizedEvent, i);
                        }
                    }
                }
            }, { passive: false });
            document.addEventListener('touchend', (e) => {
                if (isTouchDragging && touchStartElement) {
                    const touch = e.changedTouches[0];
                    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
                    if (disposeArea && (disposeArea.contains(dropTarget) || dropTarget === disposeArea)) {
                        dispose({
                            preventDefault: () => {},
                            clientX: touch.clientX,
                            clientY: touch.clientY,
                            target: dropTarget
                        });
                    }
                    else if (droppables && (droppables.contains(dropTarget) || dropTarget === droppables)) {
                        drop({
                            preventDefault: () => {},
                            clientX: touch.clientX,
                            clientY: touch.clientY,
                            target: dropTarget
                        });
                    }
                    cleanupAfterDrop();
                    isTouchDragging = false;
                    touchStartElement = null;
                    isFromLibrary = false;
                }
            });
        }
    }
}
export default DragDropSwipe;
