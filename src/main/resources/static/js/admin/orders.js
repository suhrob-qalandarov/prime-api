const socket = new SockJS("http://localhost:8080/ws");
const stompClient = Stomp.over(socket);
let movingItemID = null;
const NEW = document.getElementById('NEW');
const IN_PROGRESS = document.getElementById('IN_PROGRESS');
const COMPLETED = document.getElementById('COMPLETED');

stompClient.connect({}, function (frame) {
    console.log("WebSocket ulandi:", frame);
    stompClient.subscribe("/topic/order/new", function (message) {
        getOrders();
    });
    stompClient.subscribe("/topic/order/stop", function (message) {
        const orderId = message.body;
        if (!orderId) {
            console.error("Noto‘g‘ri buyurtma ID:", message.body);
            return;
        }
        let li = document.getElementById("order_" + orderId);
        if (li) {
            li.style.backgroundColor = "grey";
        } else {
            console.warn("Element topilmadi: order_" + orderId);
        }
    });
    stompClient.subscribe("/topic/order/dropped", function (message) {
        getOrders();
    });
}, function (error) {
    console.error("WebSocket ulanish xatosi:", error);
    alert("Serverga ulanishda xato yuz berdi!");
});

function getOrders() {
    axios.get('http://localhost:8080/api/order')
        .then(res => {
            let sNews = "";
            let sIn_progress = "";
            let sCompleted = "";

            for (let item of res.data) {
                if (!item.id || !item.status) {
                    console.warn("Noto‘g‘ri ma'lumot:", item);
                    continue;
                }
                const html = `<li ondragstart="handleDragStart(${item.id})" draggable="true" class="list-group-item" id="order_${item.id}"><h3>${item.id}</h3> ${item.localDateTime || ''}</li>`;
                if (item.status === 'NEW') {
                    sNews += html;
                } else if (item.status === 'IN_PROGRESS') {
                    sIn_progress += html;
                } else if (item.status === 'COMPLETED') {
                    sCompleted += html;
                }
            }

            NEW.innerHTML = sNews;
            IN_PROGRESS.innerHTML = sIn_progress;
            COMPLETED.innerHTML = sCompleted;
        })
        .catch(err => {
            console.error("API xatosi:", err);
            alert("Ma'lumotlarni olishda xato: " + err.message);
        });
}

function handleDragOver(ev) {
    ev.preventDefault();
}

function handleDrop(ev, status) {
    ev.preventDefault();
    if (!movingItemID) {
        alert("Buyurtma tanlanmagan!");
        return;
    }
    axios({
        url: "http://localhost:8080/api/order/" + movingItemID,
        method: "PUT",
        data: { status }
    }).then(res => {
        stompClient.send("/app/order/dropped", {}, movingItemID);
    }).catch(err => {
        console.error("API xatosi:", err);
        alert("Buyurtma holatini o‘zgartirishda xato: " + err.message);
    });
}

function handleDragStart(id) {
    if (!id) {
        console.error("Noto‘g‘ri buyurtma ID:", id);
        return;
    }
    movingItemID = id;
    stompClient.send("/app/order/stop", {}, id);
}

getOrders();
