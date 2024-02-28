if (!document.getElementsByClassName('pt_dotCarousel_view').length) {
    // 該当の要素がない場合は処理を行わない
} else {

    // DomContentloadedにイベント登録
    window.addEventListener('DOMContentLoaded', function () {

        // カルーセルの初期設定
        setInit();

        // arrowIconの取得
        const arrow = document.getElementsByClassName('pt_dotCarousel_Arrow_icon');

        for (let i = 0; i < arrow.length; i++) {

            // arrowIconにフォーカスしてEnterキー押下で処理を実行
            arrow[i].addEventListener('keydown', function (e) {

                // Enterキー押下で該当項目を選択する
                // keyCode : "13" （Enter）
                if (e.keyCode == "13") {

                    // クリックイベントを取得
                    const clickEvent = onClick();

                    // disableClassクラスが付与されていなければ実行
                    if (!this.classList.contains('pt_dotCarousel_disable')) {
                        this.dispatchEvent(clickEvent);
                    }
                }

            });
        }

        const card = document.getElementsByClassName('pt_dotCarousel_card');

        for (let i = 0; i < card.length; i++) {

            // CardにフォーカスしてTab操作で処理を実行
            card[i].addEventListener('keydown', function (e) {
                const arrowArea = this.parentElement.parentElement.parentElement.parentElement;

                // Tabキー押下で該当項目を選択する
                // keyCode : "9" （Tab）
                // shiftKey : shiftキー押下確認
                if (e.keyCode == "9" && !(e.shiftKey)) {

                    // クリックイベントを追加
                    const clickEvent = onClick();

                    // disableクラスが付与されていなければフォーカスの移動に合わせて左にスクロール
                    if (!arrowArea.children[0].children[1].classList.contains('pt_dotCarousel_disable')) {
                        arrowArea.children[0].children[1].dispatchEvent(clickEvent);
                    }
                }

                // Tabキー ＋ shiftキー押下で該当項目を選択する
                if (e.keyCode == "9" && e.shiftKey) {

                    // クリックイベントを追加
                    const clickEvent = onClick();

                    // disableクラスが付与されていなければフォーカスの移動に合わせて右にスクロール
                    if (!arrowArea.children[0].children[0].classList.contains('pt_dotCarousel_disable')) {
                        arrowArea.children[0].children[0].dispatchEvent(clickEvent);
                    }
                }

            });

            // 一番最初のカードにフォーカスが当たっていたらActiveクラスを付与
            card[i].addEventListener('keyup', function () {

                // 該当のクラスがあれば先頭のカードをアクティブにする
                if (this.classList.contains('pt_dotCarousel_firstCard')) {
                    moveElement(dots[0].parentElement.parentElement, 0, true)
                }
            })
        }
    });

    // 画面表示時の初期設定
    function setInit() {
        // active要素の前後にクラス付与
        const carousels = document.getElementsByClassName('pt_dotCarousel');
        for (let i = 0; i < carousels.length; i++) {
            // carouselItemsを取得
            const carouselListItems = carousels[i].getElementsByClassName('pt_dotCarousel_list');
            // activeのindex取得
            const activeIndex = getIndexByClass(carouselListItems, 'pt_dotCarousel_active');
            // 矢印アイコンの活性非活性切り替え

            setDisableIcon(carouselListItems.length, activeIndex,
                carousels[i].getElementsByClassName('pt_dotCarousel_Arrow_left'),
                carousels[i].getElementsByClassName('pt_dotCarousel_Arrow_right'),
                'pt_dotCarousel_disable');

            // 表示種類をDatasetに設定
            if (window.matchMedia('(max-width: 760px)').matches) {
                carousels[i].dataset.mode = 'SP';
                // SPサイズ時にアクティブ以外の要素を縮小
                setScale(carouselListItems, activeIndex);
            } else {
                carousels[i].dataset.mode = 'PC';
            }

            // カルーセルの要素が1以下の場合にドットを非表示
            if (carouselListItems.length <= 1) {
                carousels[i].getElementsByClassName('pt_dotCarousel_dotArea')[0].style.visibility = 'hidden';
            }


            // 要素の位置を設定
            setElementArea(carouselListItems, carousels[i], activeIndex);

            //画面両端にグラデーションの設定
            setGradation(carouselListItems, activeIndex)
        }
    }

    // 要素の位置を設定
    function setElementArea(carouselListItems, carousels, activeIndex) {
        const setWidth = getWidth(carousels) * activeIndex;
        for (let i = 0; i < carouselListItems.length; i++) {
            carouselListItems[i].style.transform = 'translateX(-' + setWidth + 'px)';
        }
    }

    // 要素を移動
    // 引数
    // carouselArea カルーセルのリスト
    // moveElement 移動させる要素の数
    // clickType カルーセルの操作別（ドット、スワイプ、矢印）にtrue/falseを設定
    function moveElement(carouselArea, moveElement, clickType) {

        // 子要素のitemリストを取得
        const carouselListItems = carouselArea.getElementsByClassName('pt_dotCarousel_list');
        // active要素のインデックスを取得
        let activeIndex = getIndexByClass(carouselListItems, 'pt_dotCarousel_active');

        // 移動させるactive要素のindexを設定
        // スクロールのタイプ(ドット、スワイプ、矢印)別に処理
        if (clickType) {
            activeIndex = moveElement;
        } else {
            activeIndex += moveElement;
        }

        // 移動させるactive要素のindexがエリア外の場合、移動せず処理終了
        let stopRight = 1;
        if (activeIndex < 0 || activeIndex > carouselListItems.length - stopRight) {
            return;
        }

        for (let i = 0; i < carouselListItems.length; i++) {
            // active要素を削除
            if (carouselListItems[i].classList.contains('pt_dotCarousel_active')) {
                carouselListItems[i].classList.remove('pt_dotCarousel_active');
                cntAc = i;
            }
        }

        // active要素を設定
        carouselListItems[activeIndex].classList.add('pt_dotCarousel_active')

        // SPサイズ時にアクティブ以外の要素を縮小
        setScale(carouselListItems, activeIndex);

        // 要素の位置を設定
        setElementArea(carouselListItems, carouselArea, activeIndex);

        // 画面両端にグラデーションを設定
        setGradation(carouselListItems, activeIndex);

        // 矢印アイコンの活性非活性切り替え
        setDisableIcon(carouselListItems.length, activeIndex,
            carouselArea.getElementsByClassName('pt_dotCarousel_Arrow_left'),
            carouselArea.getElementsByClassName('pt_dotCarousel_Arrow_right'),
            'pt_dotCarousel_disable');
    }

    // SPサイズ時にアクティブ以外の要素を縮小
    function setScale(carouselListItems, activeIndex) {
        for (let i = 0; i < carouselListItems.length; i++) {
            let cardElements = carouselListItems[i].getElementsByClassName('pt_dotCarousel_card');
            if (activeIndex <= i) {
                cardElements[0].classList.remove('pt_dotCarousel_card_left');
            } else if (activeIndex >= i) {
                cardElements[0].classList.remove('pt_dotCarousel_card_right');
            }
            if (activeIndex < i) {
                cardElements[0].classList.add('pt_dotCarousel_card_right');
            } else if (activeIndex > i) {
                cardElements[0].classList.add('pt_dotCarousel_card_left');
            }

        }
    }

    // SP,PCでスライドする要素の幅を取得
    function getWidth(carousels) {

        if (carousels.dataset.mode == 'SP') {
            return carousels.dataset.widthsp;
        } else {
            return carousels.dataset.widthpc;
        }
    }

    // 矢印アイコンにイベント登録
    const arrowLefts = document.getElementsByClassName('pt_dotCarousel_Arrow_left')

    for (let i = 0; i < arrowLefts.length; i++) {
        arrowLefts[i].addEventListener('click', function () {
            // 左の要素を右にスライド
            moveElement(this.parentElement.parentElement.parentElement, -1, false);
        })
    };
    const arrowRights = document.getElementsByClassName('pt_dotCarousel_Arrow_right')
    for (let i = 0; i < arrowRights.length; i++) {
        arrowRights[i].addEventListener('click', function () {
            // 右の要素を左にスライド
            moveElement(this.parentElement.parentElement.parentElement, 1, false);
        })
    };


    // 矢印アイコンの活性非活性を設定する
    function setDisableIcon(listLength, activeIndex, targetIconLeft, targetIconRight, disableClass) {
        for (let i = 0; i < targetIconLeft.length; i++) {
            if (activeIndex == 0) {
                // アクティブ要素が一番左にある時
                targetIconLeft[i].classList.add(disableClass);
            } else {
                targetIconLeft[i].classList.remove(disableClass);
            }
        }


        for (let i = 0; i < targetIconRight.length; i++) {
            // activeIndexとレングスの比較のため+1
            activeIndex++;
            if (activeIndex == listLength) {
                // アクティブ要素が一番右にある時
                targetIconRight[i].classList.add(disableClass);
            } else {
                targetIconRight[i].classList.remove(disableClass);
            }
        }
    }

    //タッチスライド、クリックスライドができる範囲
    let touchArea = document.getElementsByClassName('pt_dotCarousel_view');
    let startX;               //タッチ開始　X座標
    let clickstartX;		  //クリック開始　X座標
    let moveX;                //スワイプ中のX座標
    let clickmoveX;		  	  //クリック中の　X座標
    let dist = 30;             //スワイプを感知する最低距離（ピクセル単位）

    // タッチスライドのイベント登録
    for (let i = 0; i < touchArea.length; i++) {

        // タッチ開始時：xy座標を取得
        touchArea[i].addEventListener("touchstart", function (e) {
            //デフォルトの動作をキャンセル
            e.stopPropagation();
            startX = e.changedTouches[0].pageX;
            setTimeout(function (e) { }, 1000);
        });

        //クリック開始時：xy座標を取得
        touchArea[i].addEventListener("mousedown", function (e) {
            //デフォルトの動作をキャンセル
            e.preventDefault();
            if (e.buttons == 1) {
                clickstartX = e.pageX;
                setTimeout(function (e) { }, 1000);
            }
            else {
                return false;
            }
        });

        // スワイプ開始時：xy座標を取得
        touchArea[i].addEventListener("touchmove", function (e) {
            //デフォルトの動作をキャンセル
            e.preventDefault();
            moveX = e.changedTouches[0].pageX;
            setTimeout(function (e) { }, 1000);
        });


        //スワイプ中: xy座標の取得
        touchArea[i].addEventListener("touchend", function (e) {
            //デフォルトの動作をキャンセル
            e.preventDefault();

            if (startX > moveX && startX > moveX + dist) {

                // 要素の移動
                moveElement(this.parentElement, 1, false);
            }
            else if (startX < moveX && startX + dist < moveX) {
                // 要素の移動
                moveElement(this.parentElement, -1, false);
            }
            moveX = undefined;//初期化
        });

        //クリックスワイプ中: xy座標の取得
        touchArea[i].addEventListener("mouseup", function (e) {
            //デフォルトの動作をキャンセル
            e.preventDefault();
            clickmoveX = e.pageX;

            if (clickstartX > clickmoveX && clickstartX > clickmoveX + dist) {
                //IE対応為、thisでスライドするエリアの情報を送る
                moveElement(this.parentElement, 1, false);
            }
            else if (clickstartX < clickmoveX && clickstartX + dist < clickmoveX) {
                moveElement(this.parentElement, -1, false);
                //IE対応為、thisでスライドするエリアの情報を送る
            }
            clickmoveX = undefined; //初期化
        });
    }

    // 画面両端のカードにグラデーションを付与
    function setGradation(carouselListItems, activeIndex) {

        for (let i = 0; i < carouselListItems.length; i++) {
            // グラデーションの削除
            carouselListItems[i].classList.remove('pt_dotCarousel_grd_right');
            carouselListItems[i].classList.remove('pt_dotCarousel_grd_left');

            // アクティブインデックスの左右の要素にグラデーションを付与
            if (i == activeIndex + 1) {
                carouselListItems[i].classList.add('pt_dotCarousel_grd_right');
            } else if (i == activeIndex - 1) {
                carouselListItems[i].classList.add('pt_dotCarousel_grd_left');
            }

            // グラデーションより外側の要素を非表示
            if (i > activeIndex + 1 || i < activeIndex - 1) {
                carouselListItems[i].classList.add('pt_dotCarousel_none');
            } else {
                carouselListItems[i].classList.remove('pt_dotCarousel_none');
            }
        }
    }

    // 画面リサイズ時(PC←→SP)に要素の初期位置を再設定
    window.addEventListener('resize', function () {
        const carousels = document.getElementsByClassName('pt_dotCarousel');
        for (let i = 0; i < carousels.length; i++) {
            if (window.matchMedia('(max-width: 760px)').matches && carousels[i].dataset.mode != 'SP') {
                //PC → SP となった場合、処理を行なう
                carousels[i].dataset.mode = 'SP'
                // 要素の位置を設定
                setInit()
            } else if (!window.matchMedia('(max-width: 760px)').matches && carousels[i].dataset.mode != 'PC') {
                //SP → PC となった場合、処理を行なう
                carousels[i].dataset.mode = 'PC'
                // 要素の位置を設定
                setInit()
            }
        }
    });

    // 対象のhtmlCollectionから指定したクラス名を持つ要素の最初のindexを返却する処理
    function getIndexByClass(targetList, targetClass) {
        let returnIndex;
        returnIndex = 0;
        for (let i = 0; i < targetList.length; i++) {
            if (targetList[i].classList.contains(targetClass)) {
                returnIndex = i;
                break;
            }
        }
        return returnIndex;
    }

    // クリックイベントを発行
    function onClick() {

        let clickEvent;
        if (c_isbrowserIE()) {
            // IE
            clickEvent = document.createEvent('Event');
            clickEvent.initEvent('click', false, false);
        } else {
            // IE以外
            clickEvent = new Event('click');
        }
        return clickEvent;
    }

    /* IE判定 */
    function c_isbrowserIE() {
        // IE固有の機能を持っている場合trueを返却
        if (document.documentMode && document.uniqueID) {
            return true;
        } else {
            return false;
        }
    }
}
