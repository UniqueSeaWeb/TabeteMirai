/* ===== システムパーツ集 JS 2_08  ====== */
// ダイアログ系共通
// bodyScroll設定
function setBodyScroll() {
    // bodyタグにスクロール制御クラスが設定されている場合、先になんらかのダイアログが表示しているものとみなす
    if (document.body.classList.contains("c_bodyScroll")) {
        document.body.classList.add("c_bodyScroll_sec");
    } else {
        // 表示位置の指定用
        document.body.style.top = '-' + window.pageYOffset + 'px';
        document.body.classList.add("c_bodyScroll");
    };
}

// bodyScroll解除
function clearBodyScroll() {
    // c_bodyScroll_secがあったら既に別のダイアログが表示中のため、bodyscrollは削除しない
    if (document.body.classList.contains("c_bodyScroll_sec")) {
        document.body.classList.remove("c_bodyScroll_sec");
    } else {
        // 背景固定解除
        document.body.classList.remove('c_bodyScroll');
        scrollMove = document.body.style.getPropertyValue('top');
        if (scrollMove != '') {
            scrollMove = scrollMove.replace('-', '');
            scrollMove = scrollMove.replace('px', '');
            document.body.style.removeProperty('top');
            // スクロール位置を戻す
            window.scrollTo(0, scrollMove);
        }
    }
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

/** コンポーネント：Accordion **/
if (!document.getElementsByClassName('c_acc').length) {
    // 該当の要素がない場合は処理を行わない
} else {
    /* コンテンツ部分の高さ設定（外部呼び出し用） */
    // 引数：target：該当のアコーディオン親要素（c_accクラスのあるタグ）
    function c_acc_setHeight(target) {
        // HTML要素内には該当クラス名を持つ要素は1つのみのため配列0番目を指定
        const contentsHeight = target.getElementsByClassName('c_acc_invis')[0];
        // アコーディオンを閉じるクラスを持っているかで判定
        if (target.getElementsByClassName('c_acc_isClose').length) {
            contentsHeight.style.height = '0px';
        } else {
            // 内容部分の高さを中身分の高さに設定
            contentsHeight.style.height = contentsHeight.firstElementChild.offsetHeight + 'px';
        }
    }
    /* 初期の開閉状態を設定 */
    function setLoadedAccordion() {
        // 見出し部分のコレクションを取得
        const accVis = document.getElementsByClassName('c_acc_vis');

        // コンテンツ部分の高さ設定前のbodyの高さ
        const beforeBody = document.body.offsetHeight;

        // コンテンツ部分の高さ設定
        for (let i = 0; i < accVis.length; i++) {
            setAccordinnHeight(accVis[i]);
        }

        // コンテンツ部分の高さ設定後のbodyの高さ
        const afterBody = document.body.offsetHeight;
        let clHeight;
        // IEとそれ以外で設定値を変える
        if (c_isbrowserIE()) {
            clHeight = document.documentElement.clientHeight;
        } else {
            clHeight = window.innerHeight;
        }
        // ウィンドウの高さと比較
        if ((beforeBody > clHeight) && (afterBody < clHeight)) {
            // スクロールバーを表示
            const body = document.body;
            body.classList.add('c_acc_scrollBar');
        }

        // 最後にアコーディオンを表示する
        const accVisible = document.getElementsByClassName('c_acc');
        for (let i = 0; i < accVisible.length; i++) {
            accVisible[i].style.visibility = 'visible';
        }
    }

    /* 現在の開閉状態を設定 */
    function clickAcordion() {
        // フラグの判定
        if (this.parentElement.classList.contains('c_acc_isClose')) {
            this.parentElement.classList.remove('c_acc_isClose');
        } else {
            this.parentElement.classList.add('c_acc_isClose');
        }
        setAccordinnHeight(this);
    }

    /* コンテンツ部分の高さ設定 */
    function setAccordinnHeight(accContent) {
        if (accContent.parentElement.classList.contains('c_acc_isClose')) {
            accContent.nextElementSibling.style.height = '0px';
        } else {
            // 内容部分の高さを中身分の高さに設定
            accContent.nextElementSibling.style.height = accContent.nextElementSibling.firstElementChild.offsetHeight + 'px';
        }
    }

    // ページ読み込み時にイベント登録
    window.addEventListener('load', setLoadedAccordion);

    // 画面リサイズ時にイベント登録
    window.addEventListener('resize', function () {
        // 見出し部分のコレクションを取得
        const accVis = document.getElementsByClassName('c_acc_vis');
        for (let i = 0; i < accVis.length; i++) {
            setAccordinnHeight(accVis[i]);
        }
    });

    // アコーディオンにイベント登録
    // 見出し部分のコレクションを取得
    const accVis = document.getElementsByClassName('c_acc_vis');
    for (let i = 0; i < accVis.length; i++) {
        accVis[i].addEventListener('click', clickAcordion); // クリック時に見出し部分と内容部分の高さを設定、アイコン部分のクラスを入れ替え
    }
}

/** コンポーネント：Accordion ReadMore **/
if (!document.getElementsByClassName('c_acc02').length) {
    // 該当の要素がない場合は処理を行わない
} else {
    /* 高さ計算 */
    function c_acc02_setHeight(target) {
        const initArea = target.getElementsByClassName('c_acc02_initView')[0];
        const setHeihgt = target.getElementsByClassName('c_acc02_wrapper')[0];
        const moreArea = target.getElementsByClassName('c_acc02_MoreView');
        // 表示エリア分高さを計算する
        let moreAreaHeight = 0;
        for (let i = 0; i < moreArea.length; i++) {
            if (moreArea[i].classList.contains('c_acc02_isView')) {
                // 表示対象のクラスを持っていた場合はインライン属性のheightを削除
                // 初期値でheight値に0pxを設定するため削除する処理をいれておく
                moreArea[i].style.removeProperty('height');
                moreAreaHeight = moreAreaHeight + moreArea[i].clientHeight;
            }
        }
        // 表示エリアの高さを設定
        setHeihgt.style.height = (initArea.clientHeight + moreAreaHeight) + 'px';
    }

    /* コンテンツエリアの表示 */
    // 引数：target：該当のアコーディオン親要素（c_accクラスのあるタグ）
    function c_acc02_isOpen(target) {
        const moreArea = target.getElementsByClassName('c_acc02_MoreView');
        // コンテンツの総数を取得
        const allContents = target.getElementsByClassName('c_acc02_contentArea').length;
        // 表示しているエリアの値（初期表示を最初に設定）
        let dispContents = target.getElementsByClassName('c_acc02_initView')[0].getElementsByClassName('c_acc02_contentArea').length;

        for (let i = 0; i < moreArea.length; i++) {
            if (!moreArea[i].classList.contains('c_acc02_isView')) {
                moreArea[i].classList.add('c_acc02_isView');
                if (target.getElementsByClassName('c_acc02_readMoreArea')[0].classList.contains('c_acc02_readMoreNumber')) {
                    if (i + 1 < moreArea.length) {
                        dispContents = dispContents + moreArea[i].getElementsByClassName('c_acc02_contentArea').length;
                        number = allContents - dispContents;
                        target.getElementsByClassName('c_acc02_readMore')[0].children[0].innerHTML = 'もっと見る（' + number + '件）';
                    }
                }
                break;
            } else {
                dispContents = dispContents + moreArea[i].getElementsByClassName('c_acc02_contentArea').length;
            }
        }
        c_acc02_setHeight(target);

        // 押下エリアの表示内容切替
        // 表示対象となるエリアが全て表示されているか判定し、全て表示されていたらクリックエリアの内容を切り替える
        if (target.getElementsByClassName('c_acc02_MoreView').length == target.getElementsByClassName('c_acc02_isView').length) {
            target.getElementsByClassName('c_acc02_readMore')[0].classList.add('c_acc02_hidden');
            if (!target.getElementsByClassName('c_acc02_close').length) {
                //該当クラスを持たない場合は処理を行なわない
            } else {
                target.getElementsByClassName('c_acc02_close')[0].classList.remove('c_acc02_hidden');
            }

        }

    }
    /* コンテンツエリアの指定した初期表示対象以外を非表示 */
    // 引数：target：該当のアコーディオン親要素（c_accクラスのあるタグ）
    function c_acc02_isClose(target) {
        const moreArea = target.getElementsByClassName('c_acc02_MoreView');
        // すべての表示エリアを見えないようにする
        for (let i = 0; i < moreArea.length; i++) {
            moreArea[i].classList.remove('c_acc02_isView');
        }

        c_acc02_setHeight(target);

        // もっと見るの件数表示する場合は最初のエリアの件数に直す
        if (target.getElementsByClassName('c_acc02_readMoreArea')[0].classList.contains('c_acc02_readMoreNumber')) {
            let number = target.getElementsByClassName('c_acc02_contentArea').length - target.getElementsByClassName('c_acc02_initView')[0].getElementsByClassName('c_acc02_contentArea').length;
            target.getElementsByClassName('c_acc02_readMore')[0].children[0].innerHTML = 'もっと見る（' + number + '件）';
        }

        target.getElementsByClassName('c_acc02_readMore')[0].classList.remove('c_acc02_hidden');
        if (!target.getElementsByClassName('c_acc02_close').length) {
            //該当クラスを持たない場合は処理を行なわない
        } else {
            target.getElementsByClassName('c_acc02_close')[0].classList.add('c_acc02_hidden');
        }
    }

    window.addEventListener('load', function () {
        const targetArea = document.getElementsByClassName('c_acc02');
        for (let i = 0; i < targetArea.length; i++) {
            c_acc02_setHeight(targetArea[i]);
            if (!targetArea[i].getElementsByClassName('c_acc02_MoreView').length) {
                targetArea[i].getElementsByClassName('c_acc02_readMore')[0].classList.add('c_acc02_hidden');
            }
        }
    })

    window.addEventListener('resize', function () {
        const targetArea = document.getElementsByClassName('c_acc02');
        for (let i = 0; i < targetArea.length; i++) {
            c_acc02_setHeight(targetArea[i]);
        }
    })

    const acc02Content = document.getElementsByClassName('c_acc02_readMoreArea');
    for (let i = 0; i < acc02Content.length; i++) {
        const acc02Open = acc02Content[i].getElementsByClassName('c_acc02_readMore')[0];
        // イベントリスナー登録
        acc02Open.addEventListener('click', function () {
            c_acc02_isOpen(this.parentElement.parentElement);
        }); // クリック時に非表示エリアのクラスを削除し押下したエリアを非表示にする
        if (!acc02Content[i].getElementsByClassName('c_acc02_close').length) {
            // クラスを持たない場合は処理を行なわない
        } else {
            const acc02Close = acc02Content[i].getElementsByClassName('c_acc02_close')[0];
            acc02Close.addEventListener('click', function () {
                c_acc02_isClose(this.parentElement.parentElement);
            }); // クリック時に初期表示で隠していたエリアを再度非表示化する
        }
    }
}

/** コンポーネント：Dialog **/
if (!document.getElementsByClassName('c_modal01').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    // ダイアログ表示処理
    function showModalDialog01(targetDialogArea) {
        // ダイアログウィンドウ表示
        targetDialogArea.classList.add('c_modal01_isShow');
        // 背景固定
        setBodyScroll();
        // 高さ設定
        setMaxHeightModal01(targetDialogArea);
    }

    // ダイアログ非表示処理
    function closeModalDialog01(targetDialogArea) {
        clearBodyScroll();
        targetDialogArea.classList.remove('c_modal01_isShow');
    }

    // ダイアログ表示時用 高さ設定処理
    function setMaxHeightModal01(targetDialogArea) {
        const modalMaxHeight = 680;
        targetArea = targetDialogArea.getElementsByClassName('c_modal01_textArea')[0];
        let dialogHeight;
        // IEかどうかで取得元を変える
        if (c_isbrowserIE()) {
            dialogHeight = document.documentElement.clientHeight;
        } else {
            dialogHeight = window.innerHeight;
        }
        //iphoneではheightがvhの場合、アドレスバーが表示エリアに含まれないためこちらでheightを指定
        targetDialogArea.style.height = dialogHeight + 'px';
        //textAreaも上記同様の理由でmax-heightを指定
        //本来は64pxだがスクロールバーの表示調整でCSS側の「dialog_inner」の上下paddingが62pxのため計算値もあわせる
        targetArea.style.maxHeight = ((dialogHeight * 0.9) - 62) + 'px';
        // ダイアログのダイアログボックスの高さは最大680px
        // ただし、PC時かつウィンドウの高さの90%が上記の高さより小さい場合は、
        // ウィンドウの90%をダイアログボックスの高さとする
        if (!window.matchMedia('(max-width: 760px)').matches) {
            if (dialogHeight * 0.9 < modalMaxHeight) {
                //90%未満のときは指定したmax-heightを使用
            } else {
                //CSSで指定したmax-heightとするため削除
                targetArea.style.removeProperty('max-height');
            }
        }
    }

    // ページ表示時に各種イベント登録
    window.addEventListener('DOMContentLoaded', function () {
        // ダイアログウィンドウの表示制御
        const showModal = document.getElementsByClassName('c_modal01_showModal');
        for (let i = 0; i < showModal.length; i++) {
            showModal[i].addEventListener('click', function () {
                showModalDialog01(this.nextElementSibling);
            });
        }

        // ダイアログウィンドウの非表示制御（×ボタン押下時）
        const closeBtn = document.getElementsByClassName('c_modal01_CloseBtn');
        for (let i = 0; i < closeBtn.length; i++) {
            closeBtn[i].addEventListener('click', function (e) {
                e.stopPropagation();
                closeModalDialog01(this.parentElement.parentElement);
            });
        }

        // ダイアログウィンドウの非表示制御（背景押下時）
        const closeModal = document.getElementsByClassName('c_modal01_modal');
        for (let i = 0; i < closeModal.length; i++) {
            closeModal[i].addEventListener('click', function (e) {
                e.stopPropagation();
                // IEの場合、×ボタン押下時にdiv要素全体の押下イベントも実行されてしまうため×ボタン押下か否かを判定
                if (undefined != e.target.classList) {
                    // 押下箇所が背景の場合 かつ 非活性制御がない場合はダイアログを閉じる
                    if (e.target.classList.contains('c_modal01_modal') && !(e.target.classList.contains('c_modal01_modal_disable'))) {
                        closeModalDialog01(this);
                    }
                }
            });
        }

        // リサイズ時 高さ再設定
        window.addEventListener('resize', function () {
            if (document.getElementsByClassName('c_modal01_isShow').length) {
                setMaxHeightModal01(document.getElementsByClassName('c_modal01_isShow')[0]);
            }
        });
    });
}

/** コンポーネント：btnAreaDialog **/
// ボタンエリア付きダイアログ処理
if (!document.getElementsByClassName('c_dialog02').length) {
    //該当の要素がない場合は処理を行なわない
} else {

    // ダイアログ表示処理
    function showModalDialog02(targetDialogArea) {
        // 高さ設定
        setMaxHeightDialog02(targetDialogArea);
        // ダイアログウィンドウ表示
        targetDialogArea.classList.add('c_dialog02_isShow');
        // 背景固定
        setBodyScroll();
    }

    // ダイアログ非表示処理
    function closeModalDialog02(targetDialogArea) {
        // スクロール位置を戻すための処理
        clearBodyScroll();
        targetDialogArea.classList.remove('c_dialog02_isShow');
    }

    // ダイアログ表示時用 高さ設定処理
    function setMaxHeightDialog02(targetDialogArea) {
        const modalMaxHeight = 680;
        const buttonArea = targetDialogArea.getElementsByClassName('c_dialog02_buttonArea')[0];
        const buttonAreaHeight = buttonArea.offsetHeight;
        const textArea = targetDialogArea.getElementsByClassName('c_dialog02_textArea')[0];
        let dialogHeight;
        // IEかどうかで取得元を変える
        if (c_isbrowserIE()) {
            dialogHeight = document.documentElement.clientHeight;
        } else {
            dialogHeight = window.innerHeight;
        }
        // iOSではheightがvhの場合、アドレスバーが表示エリアに含まれないためこちらでheightを指定
        targetDialogArea.style.height = dialogHeight + 'px';
        // textAreaも上記同様の理由でmax-heightを指定
        textArea.style.maxHeight = ((dialogHeight * 0.9) - 32 - buttonAreaHeight) + 'px';
        // ただし、PC時かつウィンドウの高さの90%が最大高さより小さい場合は、
        // ウィンドウの90%をダイアログボックスの高さとする
        if (!window.matchMedia('(max-width: 760px)').matches) {
            if ((dialogHeight * 0.9) < modalMaxHeight) {
                // 90%未満のときは指定したmax-heightを使用
            } else {
                // CSSで指定したmax-heightとするため削除
                textArea.style.removeProperty('max-height');
            }
        }

        // スクロールが出ているか否かによる表示切替
        // Edge(IE)ではサイズによってscrollHeightが1px大きくなることがあるため調整のため+1pxして判定を実施
        if (textArea.scrollHeight > (textArea.clientHeight + 1)) {
            // ボタンエリアに影をつける
            buttonArea.classList.add("c_dialog02_buttonArea_shadow");
            textArea.classList.add("c_dialog02_scrollBottom");
            textArea.style.removeProperty('overflow-y');
        } else {
            buttonArea.classList.remove("c_dialog02_buttonArea_shadow");
            textArea.classList.remove("c_dialog02_scrollBottom");
            textArea.style.overflowY = 'hidden';
        }
    }

    // ページ表示時に各種イベント登録
    window.addEventListener('DOMContentLoaded', function () {
        // ダイアログウィンドウの表示制御
        const showModal = document.getElementsByClassName('c_dialog02_showModal');
        for (let i = 0; i < showModal.length; i++) {
            showModal[i].addEventListener('click', function () {
                showModalDialog02(this.nextElementSibling);
            });
        }

        // ダイアログウィンドウの非表示制御（×ボタン押下時）
        const closeBtn = document.getElementsByClassName('c_dialog02_CloseBtn');
        for (let i = 0; i < closeBtn.length; i++) {
            closeBtn[i].addEventListener('click', function (e) {
                e.stopPropagation();
                closeModalDialog02(this.parentElement.parentElement);
            });
        }

        // ダイアログウィンドウの非表示制御（背景押下時）
        const closeModal = document.getElementsByClassName('c_dialog02_modal');
        for (let i = 0; i < closeModal.length; i++) {
            closeModal[i].addEventListener('click', function (e) {
                e.stopPropagation();
                // IEの場合、×ボタン押下時にdiv要素全体の押下イベントも実行されてしまうため×ボタン押下か否かを判定
                if (undefined != e.target.classList) {
                    // 押下箇所が背景の場合 かつ 非活性制御がない場合はダイアログを閉じる
                    if (e.target.classList.contains('c_dialog02_modal') && !(e.target.classList.contains('c_dialog02_modal_disable'))) {
                        closeModalDialog02(this);
                    }
                }
            });
        }

        // リサイズ時 高さ再設定
        window.addEventListener('resize', function () {
            if (document.getElementsByClassName('c_dialog02_isShow').length) {
                setMaxHeightDialog02(document.getElementsByClassName('c_dialog02_isShow')[0]);
            }
        });
    });
}

/** コンポーネント：confirmationDialog **/
if (!document.getElementsByClassName('c_cfmDialog').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    // 確認ダイアログ表示処理
    function showCfmDialog(text, dialogSetting, buttonLeft, buttonRight) {
        const dlg = document.getElementsByClassName("c_cfmDialog")[0];
        // テキスト設定
        dlg.getElementsByClassName("c_cfmDialog_text")[0].innerText = text;
        // ダイアログ設定
        // ×ボタン表示有無
        if (dialogSetting.isVisibleCloseBtn) {
            dlg.classList.remove("c_cfmDialog_hidden_closeBtn");
        } else {
            dlg.classList.add("c_cfmDialog_hidden_closeBtn");
        }
        // 背景押下可否
        const bkScreen = dlg.getElementsByClassName('c_cfmDialog_modal')[0];
        if (dialogSetting.isClickableBackScreen) {
            bkScreen.classList.remove("c_cfmDialog_modal_disable");
        } else {
            bkScreen.classList.add("c_cfmDialog_modal_disable");
        }

        // ボタン領域設定
        // 上ボタン設定
        setBtnSetting(dlg.getElementsByClassName("c_cfmDialog_btnLeft")[0], buttonLeft);
        // 下ボタン設定
        setBtnSetting(dlg.getElementsByClassName("c_cfmDialog_btnRight")[0], buttonRight);

        // 背景固定
        setBodyScroll();
        // 高さ設定
        setMaxHeightCfmDialog(bkScreen);
        // 表示
        dlg.classList.add('c_cfmDialog_isShow');
    }

    // ダイアログ非表示処理
    function closeCfmDialog() {
        // 背景固定解除
        clearBodyScroll();
        document.getElementsByClassName("c_cfmDialog")[0].classList.remove('c_cfmDialog_isShow');
    }

    // ダイアログ表示時用 高さ設定処理
    function setMaxHeightCfmDialog(targetDialogArea) {
        const modalMaxHeight = 680;
        const buttonArea = targetDialogArea.getElementsByClassName('c_cfmDialog_buttonArea')[0];
        const buttonAreaHeight = buttonArea.offsetHeight;
        const textArea = targetDialogArea.getElementsByClassName('c_cfmDialog_textArea')[0];
        let dialogHeight;
        // IEかどうかで取得元を変える
        if (c_isbrowserIE()) {
            dialogHeight = document.documentElement.clientHeight;
        } else {
            dialogHeight = window.innerHeight;
        }
        // iOSではheightがvhの場合、アドレスバーが表示エリアに含まれないためこちらでheightを指定
        targetDialogArea.style.height = dialogHeight + 'px';
        // textAreaも上記同様の理由でmax-heightを指定
        textArea.style.maxHeight = ((dialogHeight * 0.9) - 32 - buttonAreaHeight) + 'px';
        // ただし、PC時かつウィンドウの高さの90%が最大高さより小さい場合は、
        // ウィンドウの90%をダイアログボックスの高さとする
        if (!window.matchMedia('(max-width: 760px)').matches) {
            if ((dialogHeight * 0.9) < modalMaxHeight) {
                // 90%未満のときは指定したmax-heightを使用
            } else {
                // CSSで指定したmax-heightとするため削除
                textArea.style.removeProperty('max-height');
            }
        }
        // スクロールが出ているか否かによる表示切替
        // Edge(IE)ではサイズによってscrollHeightが1px大きくなることがあるため調整のため+1pxして判定を実施
        if (textArea.scrollHeight > (textArea.clientHeight + 1)) {
            // ボタンエリアに影をつける
            buttonArea.classList.add("c_cfmDialog_buttonArea_shadow");
            textArea.classList.add("c_cfmDialog_scrollBottom");
            textArea.style.removeProperty('overflow-y');
        } else {
            buttonArea.classList.remove("c_cfmDialog_buttonArea_shadow");
            textArea.classList.remove("c_cfmDialog_scrollBottom");
            textArea.style.overflowY = 'hidden';
        }
    }

    // ボタン設定処理
    function setBtnSetting(target, btnSetting) {
        let targetBtn = target.getElementsByClassName("c_button01")[0];

        // 対象のボタン表示有無
        if (btnSetting.isShow) {
            target.classList.remove("c_cfmDialog_btnDispNon");

            // ボタン設定
            targetBtn.setAttribute("id", btnSetting.id);
            targetBtn.setAttribute("name", btnSetting.name);

            const targetBtnText = targetBtn.getElementsByClassName("c_cfmDialog_btnText")[0];
            targetBtnText.innerText = btnSetting.text;

            // Primary/Secondary出し分け
            if (btnSetting.type == "Primary") {
                targetBtn.classList.add("c_button01_green");
                targetBtn.classList.remove("c_button01_white");
                targetBtnText.classList.add("c_typo_WHT");
                targetBtnText.classList.remove("c_typo_GRN10");
            } else {
                targetBtn.classList.add("c_button01_white");
                targetBtn.classList.remove("c_button01_green");
                targetBtnText.classList.add("c_typo_GRN10");
                targetBtnText.classList.remove("c_typo_WHT");
            }

            // disabled設定
            if (btnSetting.isDisabled) {
                targetBtn.classList.add("c_button01_disabled");
            } else {
                targetBtn.classList.remove("c_button01_disabled");
            }

            // callback関数の呼び出し設定
            targetBtn.onclick = btnSetting.callback;

        } else {
            target.classList.add("c_cfmDialog_btnDispNon");
        }
    }

    // ページ表示時に各種イベント登録
    window.addEventListener('DOMContentLoaded', function () {
        // ダイアログウィンドウの非表示制御（×ボタン押下時）
        const closeBtn = document.getElementsByClassName('c_cfmDialog_CloseBtn')[0];
        closeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            closeCfmDialog();
        })

        // ダイアログウィンドウの非表示制御（背景押下時）
        const closeModal = document.getElementsByClassName('c_cfmDialog_modal')[0];
        closeModal.addEventListener('click', function (e) {
            e.stopPropagation();
            // IEの場合、×ボタン押下時にdiv要素全体の押下イベントも実行されてしまうため×ボタン押下か否かを判定
            if (undefined != e.target.classList) {
                // 押下箇所が背景の場合 かつ 非活性制御がない場合はダイアログを閉じる
                if (e.target.classList.contains('c_cfmDialog_modal') && !(e.target.classList.contains('c_cfmDialog_modal_disable'))) {
                    closeCfmDialog();
                }
            }
        })

        // リサイズ時 高さ再設定
        window.addEventListener('resize', function () {
            if (document.getElementsByClassName('c_cfmDialog_isShow').length) {
                setMaxHeightCfmDialog(document.getElementsByClassName('c_cfmDialog_modal')[0]);
            }
        });
    });
}

/** コンポーネント：Loader **/
// Loading01の参考用JS
//（使用する場合はコメントアウトは解除せずアプリ用のJSにコピーして使用すること）
if (!document.getElementsByClassName('c_loading01').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    //リサイズ時に高さを再設定
    window.addEventListener('resize', function () {
        const loading = document.getElementById('c_loading01');
        c_loading01_Setheight(loading);
    });

    // Loader高さ設定処理
    function c_loading01_Setheight(loading) {
        let clHeight;
        // IEによって使用する
        if (c_isbrowserIE()) {
            clHeight = document.documentElement.clientHeight;
        } else {
            clHeight = window.innerHeight;
        }
        loading.style.height = clHeight + 'px';
    }

    // Loader表示用処理
    function showLoader(text, progress) {
        const loading = document.getElementById('c_loading01');

        // テキストが設定されていれば設定
        if (text != undefined && text.length > 0) {
            const textArea = loading.getElementsByClassName('c_loading01_textArea')[0];
            textArea.getElementsByClassName('c_typo_bodyM')[0].innerText = text;
            loading.classList.add('c_loading01_addText');
        } else {
            loading.classList.remove('c_loading01_addText');
        }

        // プログレスの数値が設定されていれば設定
        if (progress != undefined && +progress >= 0) {
            loading.getElementsByClassName('c_loading01_progressNum')[0].innerText = progress;
            loading.classList.add('c_loading01_addProgress');
        } else {
            loading.classList.remove('c_loading01_addProgress');
        }

        // Loader表示処理
        // 表示位置の指定用
        const scrolltarget = window.pageYOffset || document.documentElement.scrollTop;
        // ローディング用モーダルの起動（ローディングが複数あることはないので固定指定）
        loading.classList.add('c_loading01_isShow');

        // 背景固定(モーダルが表示されていない場合のみ実施)
        setBodyScroll();

        // 高さ設定(iphoneでの高さ指定を考慮しJavascriptで設定)
        c_loading01_Setheight(loading);
    }

    // Loader進捗更新用処理
    function updateLoader(progress) {
        const loading = document.getElementById('c_loading01');
        const countUpTime = 10;

        // カウントアップ
        const interval = setInterval(function () {
            // 引数を数値に変換
            const progressNum = +progress;
            // 現在の進捗率を数値に変換
            const currentNum = +loading.getElementsByClassName('c_loading01_progressNum')[0].innerText;

            loading.getElementsByClassName('c_loading01_progressNum')[0].innerText = currentNum + 1;
            if (currentNum + 1 >= 100 || progressNum <= currentNum + 1) {
                clearInterval(interval);
            };
        }, countUpTime);
    }

    // Loader終了用処理
    function closeLoader() {
        const loading = document.getElementById('c_loading01');
        const countUpTime = 10;

        // 進捗率が表示されていれば100%にしてから閉じる
        if (loading.classList.contains('c_loading01_addProgress')) {
            // カウントアップ
            const interval = setInterval(function () {
                // 現在の進捗率を数値に変換
                const currentNum = +loading.getElementsByClassName('c_loading01_progressNum')[0].innerText;
                loading.getElementsByClassName('c_loading01_progressNum')[0].innerText = currentNum + 1;
                if (currentNum + 1 >= 100) {
                    clearInterval(interval);
                    closeLoaderEnd();
                };
            }, countUpTime);
        } else {
            closeLoaderEnd();
        }

        function closeLoaderEnd() {
            const loading = document.getElementById('c_loading01');

            // 閉じるときにbodyscroll解除
            clearBodyScroll();
            // Loader非表示
            loading.classList.remove('c_loading01_isShow');
        }
    }
    // コンテンツ毎のLoader設定
    // Loader高さ設定処理
    function c_loading01_PartialSetheight(loading) {
        loading.style.height = '100%';
    }

    // Loader表示用処理
    // 引数1：targetID：部分ローダーを表示する対象のID名
    // 引数2：text：部分ローダーに表示するテキスト（未設定は非表示）
    // 引数3：progress：進捗率の数値（未設定は非表示）
    // 引数4：zindex：z-indexの数値（未設定はCSSの値に準拠）
    function showPartialLoader(targetId, text, progress, zindex) {
        const loading = document.getElementById('c_loading01');
        let targetArea = document.getElementById(targetId);

        // クローン用変数の用意
        let cloneloader = loading.parentElement.cloneNode(true);
        const cloneloading = cloneloader.children[0];
        // IDを一意にする
        cloneloading.id = loading.id + '_' + targetId;
        // positionをfixedからabsoluteへ変更
        cloneloading.style.position = 'absolute';

        // テキストが設定されていれば設定
        if (text != undefined && text.length > 0) {
            const textArea = cloneloader.getElementsByClassName('c_loading01_textArea')[0];
            textArea.getElementsByClassName('c_typo_bodyM')[0].innerText = text;
            cloneloading.classList.add('c_loading01_addText');
            // 部分表示用に最小幅設定を削除
            textArea.style.minWidth = 'initial';
        } else {
            cloneloading.classList.remove('c_loading01_addText');
        }

        // プログレスの数値が設定されていれば設定
        if (progress != undefined && +progress >= 0) {
            cloneloading.getElementsByClassName('c_loading01_progressNum')[0].innerText = progress;
            cloneloading.classList.add('c_loading01_addProgress');
            // 部分表示用に幅設定を追加
            cloneloading.getElementsByClassName('c_loading01_progressArea')[0].style.width = '90%';
        } else {
            cloneloading.classList.remove('c_loading01_addProgress');
        }

        // 画像のサイズを可変にする(最大幅は元画像サイズ)
        let loadingGif = cloneloading.getElementsByClassName('c_loading01_gif')[0];
        loadingGif.style.width = '48px';
        loadingGif.style.height = 'auto';

        // Loader表示処理
        // ローディング用モーダルの起動（ローディングが複数あることはないので固定指定）
        cloneloading.classList.add('c_loading02_isShow');

        // 高さ設定(iphoneでの高さ指定を考慮しJavascriptで設定)
        c_loading01_PartialSetheight(cloneloading);

        // 親要素のborderRadiusに対する調整
        const comStyle = window.getComputedStyle(document.getElementById(targetId));

        // Edge(IEモード)ではborderradiusで取得できないため分岐処理を用意しておく
        if (comStyle.borderRadius != "") {
            cloneloading.style.borderRadius = comStyle.borderRadius;
        } else if (
            comStyle.borderTopLeftRadius != ""
            || comStyle.borderTopRightRadius != ""
            || comStyle.borderBottomLeftRadius != ""
            || comStyle.borderBottomRightRadius != ""
        ) {
            cloneloading.style.borderTopLeftRadius = comStyle.borderTopLeftRadius;
            cloneloading.style.borderTopRightRadius = comStyle.borderTopRightRadius;
            cloneloading.style.borderBottomLeftRadius = comStyle.borderBottomLeftRadius;
            cloneloading.style.borderBottomRightRadius = comStyle.borderBottomRightRadius;
        }
        //引数4が未設定出ない場合
        if (zindex != undefined || zindex != "") {
            cloneloading.style.zIndex = zindex
        }

        targetArea.appendChild(cloneloader);
    }

    // Loader進捗更新用処理
    function updatePartialLoader(targetId, progress) {
        const id = 'c_loading01_' + targetId;
        const loading = document.getElementById(id);
        const countUpTime = 10;

        // カウントアップ
        const interval = setInterval(function () {
            // 引数を数値に変換
            const progressNum = +progress;
            // 現在の進捗率を数値に変換
            const currentNum = +loading.getElementsByClassName('c_loading01_progressNum')[0].innerText;

            loading.getElementsByClassName('c_loading01_progressNum')[0].innerText = currentNum + 1;
            if (currentNum + 1 >= 100 || progressNum <= currentNum + 1) {
                clearInterval(interval);
            };
        }, countUpTime);
    }

    // Loader終了用処理
    function closePartialLoader(targetId) {
        const id = 'c_loading01_' + targetId;
        const loading = document.getElementById(id);
        const targetArea = document.getElementById(targetId);
        const countUpTime = 10;

        // 進捗率が表示されていれば100%にしてから閉じる
        if (loading.classList.contains('c_loading01_addProgress')) {
            // カウントアップ
            const interval = setInterval(function () {
                // 現在の進捗率を数値に変換
                const currentNum = +loading.getElementsByClassName('c_loading01_progressNum')[0].innerText;
                loading.getElementsByClassName('c_loading01_progressNum')[0].innerText = currentNum + 1;
                if (currentNum + 1 >= 100) {
                    clearInterval(interval);
                    closePartialLoaderEnd(targetArea, loading);
                };
            }, countUpTime);
        } else {
            closePartialLoaderEnd(targetArea, loading);
        }

        function closePartialLoaderEnd(parent, target) {
            parent.removeChild(target.parentElement);
        }
    }
}

/** コンポーネント：Notification **/
if (!document.getElementsByClassName('c_notification_closeIcon').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    const notification = document.getElementsByClassName('c_notification_closeIcon');

    for (let i = 0; i < notification.length; i++) {
        notification[i].addEventListener('click', function () {
            this.parentElement.parentElement.classList.add('c_notification_hidden');
        });

        notification[i].addEventListener('keydown', function (e) {
            let clickEvent;
            // クリックイベントの生成
            if (c_isbrowserIE()) {
                clickEvent = document.createEvent('Event');
                clickEvent.initEvent('click', false, true);
            } else {
                clickEvent = new Event('click');
            }

            // EnterキーもしくはSpace押下で該当項目を選択する
            // keyCode : "13" （Enter）
            if (e.keyCode == "13") {
                this.dispatchEvent(clickEvent);
            }
        });
    };
}

/** コンポーネント：Pulldown **/
if (!document.getElementsByClassName('c_pullDown01').length) {
    // 該当の要素がない場合は処理を行わない
} else {
    // select要素からリスト生成
    function makePull() {
        // selestタグ取得
        const pull_select = document.getElementsByClassName('c_pullDown01_select');

        // 既にUlに作成されているliを削除
        const collectionListUl = document.getElementsByClassName('c_pullDown01_list');
        for (let i = 0; i < pull_select.length; i++) {
            if (collectionListUl[i].hasChildNodes()) {
                collectionListUl[i].innerHTML = '';
            }
        }

        //プルダウンメニューをすべてに対して処理
        for (let i = 0; i < pull_select.length; i++) {

            //プルダウンメニュー内のoptionタグからliタグを生成
            for (let j = 0; j < pull_select[i].length; j++) {

                // 作成するli
                const newLi = document.createElement('li');
                newLi.setAttribute('tabindex', '0');
                // 各リストの下線用div
                const listBorderDiv = document.createElement("div");
                // liタグ内に追加するチェックアイコン用のdiv
                const checkDiv = document.createElement("div");
                // liタグ内に追加する選択項目テキスト用のp
                const listP = document.createElement('p');
                listP.className = 'c_typo_bodyM c_typo_BLK10 c_typo_align_left';

                // li
                // 選択されているoptionの場合、選択されていることを明示するクラス名を追加
                if (pull_select[i].options[j].value == pull_select[i].value) {
                    newLi.classList.add("c_pullDown01_selected");
                    listP.className = 'c_typo_headerS c_typo_BLK10 c_typo_align_left';
                }
                newLi.dataset.value = pull_select[i].options[j].value;

                // 下線用div
                listBorderDiv.classList.add("c_pullDown01_listBorder");
                // チェックアイコン用div
                checkDiv.classList.add("c_pullDown01_icon_check");

                // チェックアイコンsvg生成
                const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                checkSvg.setAttribute("width", "24");
                checkSvg.setAttribute("height", "24");
                checkSvg.setAttribute("viewbox", "0 0 24 24");
                checkSvg.setAttribute("fill", "none");
                const checkSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                checkSvgPath.setAttribute('d', 'M7.80859 12.4721L10.1657 14.8572L16.1895 8.76196');
                checkSvgPath.setAttribute('stroke', '#008673');
                checkSvgPath.setAttribute('stroke-width', 2);
                checkSvgPath.setAttribute('stroke-linecap', 'round');
                checkSvgPath.setAttribute('stroke-linejoin', 'round');
                checkSvg.appendChild(checkSvgPath);
                // divにチェックアイコンsvg追加
                checkDiv.appendChild(checkSvg);
                // プルダウンメニューのoptionタグのテキストをliのpに反映
                listP.innerHTML = pull_select[i].options[j].innerHTML;
                // チェックアイコンsvgの親div追加
                listBorderDiv.appendChild(checkDiv);
                // P追加
                listBorderDiv.appendChild(listP);

                // プルダウンメニューのoptionに凡例フラグがある場合にliに凡例アイコン追加
                if (pull_select[i].options[j].classList.contains('c_pullDown01_hanrei_icon')) {
                    // liに追加する凡例アイコン用のdiv
                    const hanreiDiv = document.createElement("div");
                    hanreiDiv.classList.add("c_pullDown01_icon_hanrei");
                    // liに追加する凡例アイコンsvg生成
                    const hanreiSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                    hanreiSvg.setAttribute("width", "24");
                    hanreiSvg.setAttribute("height", "24");
                    hanreiSvg.setAttribute("viewbox", "0 0 24 24");
                    hanreiSvg.setAttribute("fill", "none");
                    const hanreiSvgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    hanreiSvgRect.setAttribute("x", "4");
                    hanreiSvgRect.setAttribute("y", "4");
                    hanreiSvgRect.setAttribute("width", "16");
                    hanreiSvgRect.setAttribute("height", "16");
                    hanreiSvgRect.setAttribute("rx", "8");
                    hanreiSvgRect.setAttribute("fill", "#E53935");
                    const hanreiSvgPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    hanreiSvgPath1.setAttribute("d", "M11.9945 17C12.5628 17 13 16.5625 13 16C13 15.4271 12.5628 15 11.9945 15C11.4262 15 11 15.4271 11 16C11 16.5625 11.4262 17 11.9945 17Z");
                    hanreiSvgPath1.setAttribute("fill", "white");
                    const hanreiSvgPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    hanreiSvgPath2.setAttribute("d", "M12.9324 8.91535L12.6848 13.3524C12.6645 13.7157 12.3639 14 12 14C11.6361 14 11.3355 13.7157 11.3152 13.3524L11.0676 8.91535L11.0353 7.99938C11.016 7.45323 11.4535 7 12 7C12.5465 7 12.984 7.45323 12.9647 7.99938L12.9324 8.91535Z");
                    hanreiSvgPath2.setAttribute("fill", "white");
                    hanreiSvg.appendChild(hanreiSvgRect);
                    hanreiSvg.appendChild(hanreiSvgPath1);
                    hanreiSvg.appendChild(hanreiSvgPath2);
                    // 凡例アイコンdivに凡例アイコンsvg追加
                    hanreiDiv.appendChild(hanreiSvg);
                    // liに凡例アイコンdivの追加
                    listBorderDiv.appendChild(hanreiDiv);
                }
                // 下線用div追加
                newLi.appendChild(listBorderDiv);

                // optionがhiddenならliを表示しない
                // optionタグにhiddenが設定されているか判定
                if (pull_select[i].options[j].hidden) {
                    newLi.style.display = "none";
                }

                // li追加
                document.getElementsByClassName('c_pullDown01_list')[i].appendChild(newLi);

                // menuの初期表示テキストとして選択されている項目のテキストを表示
                if (newLi.classList.contains('c_pullDown01_selected')) {
                    document.getElementsByClassName('c_pullDown01_menu_selected')[i].innerHTML = listBorderDiv.innerHTML.replace('c_typo_BLK10', 'c_typo_GRN10').replace('c_typo_align_left', 'c_typo_align_left c_typo_oneLine');
                }

                // リスト押下時にイベント登録
                newLi.addEventListener('click', clickPullDownSelectList);

                // キー操作が行われたら処理を実行
                newLi.addEventListener('keydown', function (e) {
                    // クリックイベントの生成
                    if (c_isbrowserIE()) {
                        clickEvent = document.createEvent('Event');
                        clickEvent.initEvent('click', false, true);
                    } else {
                        clickEvent = new Event('click');
                    }

                    // EnterキーもしくはSpace押下で該当項目を選択する
                    // keyCode : "13" （Enter）
                    if (e.keyCode == "13") {
                        this.dispatchEvent(clickEvent);
                    }
                });
            }
        }
    }

    /* プルダウンの開閉状態を設定 */
    function clickPullDown() {
        // 対象のプルダウンを設定
        const parentPullDown = this.parentElement;

        // 押下したプルダウン以外はすべて閉じる
        const pulldown = document.getElementsByClassName('c_pullDown01');
        for (let i = 0; i < pulldown.length; i++) {
            if ((pulldown[i] != parentPullDown) && (pulldown[i].classList.contains('c_pullDown01_isOpen'))) {
                pulldown[i].classList.remove('c_pullDown01_isOpen');
            }
        }

        // 開閉フラグの判定
        if (parentPullDown.classList.contains('c_pullDown01_isOpen')) {
            // 開いている状態なら閉じる
            // openフラグの削除
            parentPullDown.classList.remove('c_pullDown01_isOpen');
        } else {
            // 閉じている状態なら開く
            // リストの表示位置・高さを指定する関数を呼び出す
            setListBox(parentPullDown);
            // openフラグの追加
            parentPullDown.classList.add('c_pullDown01_isOpen');
        }
    }

    /* リストボックスの高さを取得し表示位置を設定 */
    function setListBox(targetElement) {
        // 各パーツを変数化
        // 対象のプルダウンメニュー
        const targetPullDownMenu = targetElement.getElementsByClassName('c_pullDown01_menu')[0];
        // 対象のリストボックス
        const listBox = targetElement.getElementsByClassName('c_pullDown01_listBox')[0];
        // リストボックスに含まれる凡例行
        const hanrei = listBox.getElementsByClassName('c_pullDown01_hanrei');

        // 画面の高さ取得
        const windowHeight = document.documentElement.clientHeight;
        // プルダウンメニューの画面内のtop位置取得
        const pullDownMenuTop = targetPullDownMenu.getBoundingClientRect().top;
        // プルダウンメニューの画面内のbottom位置取得
        const pullDownMenuBottom = targetPullDownMenu.getBoundingClientRect().bottom;
        // プルダウンメニューの高さ
        const pullDownMenuHeight = targetPullDownMenu.offsetHeight;
        // リストボックスとプルダウンメニュー間の余白(8px)
        const listMargin = 8;
        // リストボックスの表示位置
        const listBoxPosition = pullDownMenuHeight + listMargin;
        // 上に伸びる際のリスト表示可能エリア
        const listAreaUpper = pullDownMenuTop - (listMargin * 2);
        // 下に伸びる際のリストの表示可能エリア
        const listArea = windowHeight - (pullDownMenuBottom + (listMargin * 2));

        // プルダウンの上下余白を比較
        if (listAreaUpper > listArea) {
            // プルダウンエリア最上部から余白8px上に表示
            listBox.style.bottom = listBoxPosition + "px";
            listBox.style.top = '';

            // リストボックスの高さの最大値を設定
            listBox.style.maxHeight = listAreaUpper + "px";
        } else {
            // 通常は下に伸びる
            // プルダウンエリア最上部からメニューの高さ＋余白8px下に表示
            listBox.style.top = listBoxPosition + "px";
            listBox.style.bottom = null;

            // リストボックスの高さの最大値を設定
            listBox.style.maxHeight = listArea + "px";
        }
    }

    /* リストの選択状態を設定 */
    function clickPullDownSelectList() {
        // フラグの判定
        if (!this.classList.contains('c_pullDown01_selected')) {
            // 各パーツを変数化
            // 全リスト
            const list = this.parentElement.children;
            // 対象プルダウン
            const targetElement = this.parentElement.parentElement.parentElement;
            // 対象プルダウンメニューのテキストエリア
            const pullDownMenuText = targetElement.getElementsByClassName('c_pullDown01_menu_selected')[0];
            // プルダウンメニュー
            const thisSelect = targetElement.getElementsByClassName('c_pullDown01_select')[0];

            // リスト選択有無フラグ設定削除
            for (let i = 0; i < list.length; i++) {
                list[i].classList.remove('c_pullDown01_selected');
                list[i].innerHTML = list[i].innerHTML.replace('c_typo_headerS', 'c_typo_bodyM');
            }
            // 選択フラグの設定
            this.classList.add('c_pullDown01_selected');
            this.innerHTML = this.innerHTML.replace('c_typo_bodyM', 'c_typo_headerS');

            // プルダウンメニューのテキスト設定
            pullDownMenuText.innerHTML = this.getElementsByClassName('c_pullDown01_listBorder')[0].innerHTML.replace('c_typo_BLK10', 'c_typo_GRN10').replace('c_typo_align_left', 'c_typo_align_left c_typo_oneLine');

            // optionタグにselectedを設定
            for (let i = 0; i < thisSelect.length; i++) {
                if (thisSelect.options[i].value == this.dataset.value) {
                    thisSelect.options[i].selected = true;

                    // onchangeイベント発火
                    if (thisSelect.onchange) {
                        thisSelect.onchange();
                    }
                }
            }

            // 選択したらリストを非表示
            // openフラグの削除
            targetElement.classList.remove('c_pullDown01_isOpen');
        }
    }

    // 画面読み込み時にプルダウンリスト生成
    window.addEventListener('DOMContentLoaded', makePull);

    // コレクションを取得
    const pullDownMenu = document.getElementsByClassName('c_pullDown01_menu');
    // プルダウンメニュー押下時にイベント登録
    for (let i = 0; i < pullDownMenu.length; i++) {
        pullDownMenu[i].addEventListener('click', clickPullDown); // クリック時に見出し部分と内容部分の高さを設定、アイコン部分のクラスを入れ替え
    }

    // コレクションを取得
    const pullDownOutSideClose = document.getElementsByClassName('c_pullDown01_outSideClose');

    // エリア外押下にイベント登録
    for (let i = 0; i < pullDownOutSideClose.length; i++) {
        pullDownOutSideClose[i].addEventListener('click', clickPullDown); // クリック時に見出し部分と内容部分の高さを設定、アイコン部分のクラスを入れ替え
    }

    // リサイズ
    window.addEventListener('resize', function () {
        const openMenu = document.getElementsByClassName('c_pullDown01_isOpen');
        for (let i = 0; i < openMenu.length; i++) {
            setListBox(openMenu[i]);
        }
    });

    window.addEventListener('DOMContentLoaded', function () {
        const pullDownList = document.getElementsByClassName('c_pullDown01');

        for (let i = 0; i < pullDownList.length; i++) {
            let clickEvent;
            // キー操作が行われたら処理を実行
            pullDownList[i].children[1].addEventListener('keydown', function (e) {
                // クリックイベントの生成
                if (c_isbrowserIE()) {
                    clickEvent = document.createEvent('Event');
                    clickEvent.initEvent('click', false, true);
                } else {
                    clickEvent = new Event('click');
                }

                // EnterキーもしくはSpace押下で該当項目を選択する
                // keyCode : "13" （Enter）
                if (e.keyCode == "13") {
                    this.dispatchEvent(clickEvent);
                }
            });
        }

    })

}

/** コンポーネント：Progressbar **/
if (!document.getElementsByClassName('c_pgb').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    //初期処理時の処理
    //適用したデータセット・クラス・スタイルを初期化
    function initProgress() {
        const progresstitle = document.getElementsByClassName('c_pgb');

        for (let i = 0; i < progresstitle.length; i++) {
            let child = progresstitle[i].children;
            // progressbarの子要素の配列をchildと定義する
            for (let j = 0; j < child.length; j++) {
                child[j].dataset.value = 0;
                const targetBar = child[j].getElementsByClassName('c_pgb_bar')[0];
                targetBar.style.height = '0';
            }
        }
    }

    function progressMove() {
        // startOffsetにブラウザの内側の高さの半分の長さを設定
        let clHeight;
        // IEによって使用する
        if (c_isbrowserIE()) {
            clHeight = document.documentElement.clientHeight;
        } else {
            clHeight = window.innerHeight;
        }
        const startOffset = clHeight / 2;
        const progresstitle = document.getElementsByClassName('c_pgb');

        //p c_pgb単位（バーの固まり単位に）に処理を実行
        for (let i = 0; i < progresstitle.length; i++) {
            let child = progresstitle[i].children;
            //プログレスバー単位に処理を実行
            for (let j = 0; j < child.length; j++) {
                const calcRect = child[j].getBoundingClientRect();
                const targetBar = child[j].getElementsByClassName('c_pgb_bar')[0];
                const targetNumber = child[j].getElementsByClassName('c_pgb_number')[0];

                // 画面半分よりも上に要素が来た場合、クラスを設定し丸の色を変更
                // 画面半分よりも上に要素すべてが通過した場合は、プログレスバーをすべて黄色く表示（１００％にする）
                // 要素が画面半分にかかっている場合（通過中）、プログレスバーは画面中央まで伸びるように黄色のプログレスバーの高さを設定
                // ただし、プログレスバーは一度伸びると縮まない仕様のため、最大値をデータセットに保存し、その値を比較
                if (calcRect.top <= startOffset) {
                    targetNumber.classList.add('c_pgb_number_yellow');
                    if (calcRect.bottom < startOffset) {
                        child[j].dataset.value = 100;
                        targetBar.style.height = '100%';
                        if (j != (child.length - 1)) {
                            targetBar.style.borderRadius = '0px';
                        }
                    } else {
                        if (child[j].dataset.value == 100) {
                        } else {
                            const heightRatio = (startOffset - calcRect.top) / calcRect.height * 100;
                            // 下のif文は一度黄色になった部分を灰色に戻さないための処理
                            if (child[j].dataset.value < heightRatio) {
                                child[j].dataset.value = heightRatio;
                                targetBar.style.height = heightRatio + '%';
                            }
                        }
                    }
                }
            }
        }
    }

    // スクロール時にイベント登録
    window.addEventListener('scroll', progressMove);

    // ページ読み込み時にイベント登録
    window.addEventListener('DOMContentLoaded', function () {
        initProgress();
        progressMove();
    });

    // 画面サイズが変わってもスクロールがされるための処理
    window.addEventListener('resize', progressMove);
}

/** コンポーネント：Tab Line **/
if (!document.getElementsByClassName('c_tab').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    // コンテンツ選択ボタンに処理紐づけ
    const tabClicked = document.getElementsByClassName('c_tab_tabText');
    for (let i = 0; i < tabClicked.length; i++) {
        // sectionエリア取得
        let sectionArea = tabClicked[i].parentElement.parentElement.parentElement;
        if (!sectionArea.classList.contains('c_tab')) {
            sectionArea = sectionArea.parentElement;
        }

        // 画面遷移フラグがなかったら、クリックイベント登録
        if (!sectionArea.classList.contains('c_tab_pageTransition')) {
            // タブクリック
            tabClicked[i].addEventListener('click', function () {
                // 押下タブ
                const tab = this.parentElement;
                // ターゲットID
                const targetId = tab.dataset.target_id;
                // sectionエリア内タグ
                const tabInsection = sectionArea.getElementsByClassName('c_tab_tabText');
                // sectionエリアコンテンツエリア
                const contentsArea = sectionArea.getElementsByClassName('c_tab_targetContents')[0];
                // sectionエリア内コンテンツ
                const contents = contentsArea.children;

                // tabのタブ選択有無フラグ設定削除
                for (let i = 0; i < tabInsection.length; i++) {
                    tabInsection[i].parentElement.classList.remove('c_tab_tabSelected');
                }
                // 押下タブにタブ選択有無フラグ設定
                tab.classList.add('c_tab_tabSelected');

                // コンテンツ切替
                for (let i = 0; i < contents.length; i++) {
                    contents[i].classList.remove('c_tab_active');
                    // コンテンツにtargetIdと同じクラス名があったら表示
                    if (contents[i].classList.contains(targetId)) {
                        contents[i].classList.add('c_tab_active');
                    }
                }
            });
        }
    }
}

/** コンポーネント：Tab Button/Button-mini **/
if (!document.getElementsByClassName('c_tabEllipse').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    // 選択したタブの設定処理
    function setSelectTab(cliclkTab, sectionArea) {
        // ターゲットID
        const targetId = cliclkTab.dataset.target_id;
        // sectionエリア内タグ
        const tabInsection = sectionArea.getElementsByClassName('c_tabEllipse_tab');
        // コンテンツエリア
        const contents = sectionArea.getElementsByClassName('c_tabEllipse_targetContents')[0].children;

        // tabのタブ選択有無フラグ設定削除
        for (let i = 0; i < tabInsection.length; i++) {
            tabInsection[i].classList.remove('c_tabEllipse_tabSelected');
        }
        // 押下タブにタブ選択有無フラグ設定
        cliclkTab.classList.add('c_tabEllipse_tabSelected');

        // コンテンツ切替
        for (let i = 0; i < contents.length; i++) {
            contents[i].classList.remove('c_tabEllipse_active');
            // コンテンツにtargetIdと同じクラス名があったら表示
            if (contents[i].classList.contains(targetId)) {
                contents[i].classList.add('c_tabEllipse_active');
            }
        }
    }

    // タブの幅設定処理
    function setTabSize() {
        // 各タブに処理紐づけ
        const tab = document.getElementsByClassName('c_tabEllipse');
        for (let i = 0; i < tab.length; i++) {
            // Button-miniの場合、タブの幅設定
            if (tab[i].classList.contains('c_tab_mini')) {
                const tabButton = tab[i].getElementsByClassName('c_tabEllipse_tab');
                const tabArea = tab[i].getElementsByClassName('c_tabEllipse_tabArea')[0];
                const tabArea_maxWidth = Number((window.getComputedStyle(tabArea).getPropertyValue('max-width')).replace('px', ''));
                const tabArea_paddingL = Number((window.getComputedStyle(tabArea).getPropertyValue('padding-left')).replace('px', ''));
                const tabArea_paddingR = Number((window.getComputedStyle(tabArea).getPropertyValue('padding-right')).replace('px', ''));
                let tabBtn_marginR = 0;
                for (let i = 0; i < tabButton.length; i++) {
                    tabBtn_marginR += Number((window.getComputedStyle(tabButton[i]).getPropertyValue('margin-right')).replace('px', ''));
                }
                // タブエリアの余白
                const marginAll = tabArea_paddingL + tabArea_paddingR + tabBtn_marginR;

                // タブの幅を初期化
                for (let i = 0; i < tabButton.length; i++) {
                    tabButton[i].style.removeProperty('width');
                }
                tabArea.style.removeProperty('width');

                // タブの最大幅を取得
                let tabList = [];
                for (let i = 0; i < tabButton.length; i++) {
                    tabList.push(tabButton[i].offsetWidth);
                }
                const tabSize = Math.max.apply(null, tabList);

                // タブ表示領域の幅を取得（タブエリアから余白分を引く）
                const tabAreaWidth = tabArea_maxWidth - marginAll;

                // タブエリアの幅設定
                if ((tabSize * tabButton.length) < tabAreaWidth) {
                    tabArea.style.width = ((tabSize * tabButton.length) + marginAll) + 'px';
                } else {
                    tabArea.style.width = tabArea_maxWidth + 'px';
                }

                // 各タブの横幅設定
                for (let i = 0; i < tabButton.length; i++) {
                    tabButton[i].style.width = (tabArea.offsetWidth - marginAll) / tabButton.length + 'px';
                }
            }
        }
    }

    // ページ表示時
    window.addEventListener('DOMContentLoaded', setTabSize);
    // リサイズ時 タブの幅設定
    window.addEventListener('resize', setTabSize);
    // クリックイベント登録
    const tab = document.getElementsByClassName('c_tabEllipse');
    for (let i = 0; i < tab.length; i++) {
        const sectionArea = tab[i];
        // 画面遷移フラグがない場合
        if (!sectionArea.classList.contains('c_tabEllipse_pageTransition')) {
            const tabClicked = sectionArea.getElementsByClassName('c_tabEllipse_tab');
            for (let j = 0; j < tabClicked.length; j++) {
                // タブクリック
                tabClicked[j].addEventListener('click', function () {
                    setSelectTab(this, sectionArea);
                });
            }
        }
    }
}
/** コンポーネント：Button01 **/
if (!document.getElementsByClassName('c_button01').length) {
    //該当の要素がない場合は処理を行なわない
} else {

    const button = document.getElementsByClassName('c_button01');
    for (let i = 0; i < button.length; i++) {
        button[i].addEventListener('keydown', function (e) {

            // disableの場合、エンターキーを無効にする
            if (this.classList.contains('c_button01_disabled')) {
                // keyCode : "13" （Enter）
                if (e.keyCode == "13") {
                    e.preventDefault();
                }
            }
        })
    }
}

/** コンポーネント：Button02 **/
if (!document.getElementsByClassName('c_button02').length) {
    //該当の要素がない場合は処理を行なわない
} else {

    const button = document.getElementsByClassName('c_button02');
    for (let i = 0; i < button.length; i++) {
        button[i].addEventListener('keydown', function (e) {

            // disableの場合、エンターキーを無効にする
            if (this.classList.contains('c_button02_disabled')) {
                // keyCode : "13" （Enter）
                if (e.keyCode == "13") {
                    e.preventDefault();
                }
            }
        })
    }
}

/** コンポーネント：Text field（dropdown） **/
if (!document.getElementsByClassName('c_textField_dropdown').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    // ドロップダウンエリアを取得
    const textFields = document.getElementsByClassName('c_textField_dropdown');
    for (let i = 0; i < textFields.length; i++) {
        textFields[i].getElementsByClassName('c_textField_inputText')[0].addEventListener('change', function () {
            // クラスの付け替え
            if (this.selectedIndex == 0) {
                this.parentElement.classList.add('c_textField_NoSelected');
            } else {
                this.parentElement.classList.remove('c_textField_NoSelected');
            }
        });
    }
}

/** コンポーネント：Text field（textarea） **/
if (!document.getElementsByClassName('c_textField_textarea').length) {
    // 該当の要素がない場合は処理を行なわない
} else {

    // テキストエリアのactive設定
    function textareaActive(textarea) {
        // textareaにフォーカスをあてる
        textarea.focus();
        // テキストエリアがデフォルトの場合は、active設定
        if (textarea.parentElement.classList.contains('c_textField05_default')) {
            textarea.parentElement.classList.add('c_textField05_active');
        }
    }

    // textareaクリックイベント
    const textareaArea = document.getElementsByClassName('c_textField_textarea');
    for (let i = 0; i < textareaArea.length; i++) {
        textareaArea[i].addEventListener('click', function () {
            // textareaの要素を取得
            const textarea = this.getElementsByClassName('c_textField05_inputText')[0];
            textareaActive(textarea);
        });
    }

    // textareaの要素を取得
    const textarea = document.getElementsByClassName('c_textField05_inputText');
    for (let i = 0; i < textarea.length; i++) {
        // textareaのフォーカス時のイベント
        textarea[i].addEventListener('focus', function () {
            textareaActive(this);
        });

        // textareaのフォーカス時以外のイベント
        textarea[i].addEventListener('blur', function () {
            // activeの設定解除
            this.parentElement.classList.remove('c_textField05_active');

        });
    }
}

/** コンポーネント：Text link02 **/
if (!document.getElementsByClassName('c_textLink02').length) {
    //該当の要素がない場合は処理を行なわない
} else {

    const button = document.getElementsByClassName('c_textLink02');
    for (let i = 0; i < button.length; i++) {
        button[i].addEventListener('keydown', function (e) {

            // disableの場合、エンターキーを無効にする
            if (this.classList.contains('c_textLink02_disabled')) {

                // keyCode : "13" （Enter）
                if (e.keyCode == "13") {
                    e.preventDefault();
                }
            }
        })
    }
}



/** コンポーネント：Toast **/
if (!document.getElementsByClassName('c_toast01').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    let fadeTimeout;
    let colorTimeout;
    // トースト表示用メソッド
    // 引数
    //  variation : 表示するトーストの種類（informative:青 success:緑 warning:橙 error:赤）
    //  message   : old_global向け、テキストのみ設定
    //	closeIcon : ×アイコン有無（true:あり false:なし）
    //	tag       : 任意の要素に設定するHTML構成を設定
    function showToast01(variation, message, closeIcon, tag) {

        // 取得した要素にクリックイベント用のクラスがある場合はタグの構成が異なるため処理を行わない
        const cToast = document.getElementsByClassName('c_toast01')[0];
        if (cToast.getElementsByClassName('c_toast01_showToast').length) {
            return false;
        }

        // busy状態または、トーストの種類を指定しない場合は処理を行なわない
        const toast = cToast.getElementsByClassName('c_toast01_toast')[0];
        if (variation != 'informative' && variation != 'success' && variation != 'warning' && variation != 'error') {
            return false;
        }

        // トーストの種類
        // トーストの種類を指定したときのフラグ
        toast.classList.add('c_toast01_custom');

        // アラートアイコン
        const iconExcl = toast.getElementsByClassName('c_iconAndText01_exclamation')[0];
        const iconSuccess = toast.getElementsByClassName('c_iconAndText01_success')[0];

        // 初回判定のためにiconExcl および iconSuccessの両方にclass「c_iconAndText01_hidden」が付与されていないことで確認
        if (!iconExcl.classList.contains('c_iconAndText01_hidden') && !iconSuccess.classList.contains('c_iconAndText01_hidden')) {
            //iOS向け、値設定しないとブロック変数が読み取れないため必ず値を設定する
            fadeTimeout = 0;
            colorTimeout = 0;
        }
        // クラス初期化
        iconExcl.classList.remove('c_iconAndText01_informative');
        iconExcl.classList.remove('c_iconAndText01_warning');
        iconExcl.classList.remove('c_iconAndText01_error');
        iconExcl.classList.remove('c_iconAndText01_hidden');

        iconSuccess.classList.remove('c_iconAndText01_hidden');
        clearColorToast(toast);
        // 表示するトーストの色とアイコンを設定
        switch (variation) {
            case ('informative'):
                toast.classList.add('c_toast01_blue');
                iconExcl.classList.add('c_iconAndText01_informative');
                iconSuccess.classList.add('c_iconAndText01_hidden');
                break;

            case ('success'):
                toast.classList.add('c_toast01_green');
                iconExcl.classList.add('c_iconAndText01_hidden');
                break;

            case ('warning'):
                toast.classList.add('c_toast01_orange');
                iconExcl.classList.add('c_iconAndText01_warning');
                iconSuccess.classList.add('c_iconAndText01_hidden');
                break;

            case ('error'):
                toast.classList.add('c_toast01_red');
                iconExcl.classList.add('c_iconAndText01_error');
                iconSuccess.classList.add('c_iconAndText01_hidden');
                break;
        }
        const optionalArea = document.getElementsByClassName('c_toast01_optionalArea')[0];
        // 任意の要素設定
        if (tag != undefined && tag != '') {
            // 任意の要素をトーストに設定
            optionalArea.innerText = '';
            optionalArea.insertAdjacentHTML('afterbegin', tag);
            // 任意の要素が設定されている場合、old_global向けの処理を行なわないようmessageの値を更新
            message = '';
        }

        // メッセージ(old_globa資源対応)
        if (message != undefined && message != '') {
            // メッセージをトーストに設定
            toast.getElementsByTagName('p')[0].innerText = message;
        }

        // ×アイコン有無
        if (closeIcon != undefined) {
            const close = document.getElementsByClassName('c_iconAndText01_closeIcon')[0];
            // クラス初期化
            close.classList.remove('c_iconAndText01_hidden');
            if (!closeIcon) {
                // ×アイコンなしの場合、非表示
                close.classList.add('c_iconAndText01_hidden');
            }
        }

        // トースト表示（フェードイン）呼び出し
        fadeInToast01(toast);
    }

    // トースト表示（フェードイン）
    function fadeInToast01(toast) {
        //すでにfadeinがある場合は先に一回閉じる
        if (document.getElementsByClassName('c_toast01_fadeIn').length > 0 || document.getElementsByClassName('c_toast01_fadeout').length > 0) {
            const fadeinclass = document.getElementsByClassName('c_toast01_fadeIn')[0];
            const fadeoutclass = document.getElementsByClassName('c_toast01_fadeout')[0];
            if (fadeoutclass != undefined) {
                fadeoutclass.classList.remove('c_toast01_fadeout');
            }
            if (fadeTimeout > 0 && fadeTimeout != undefined) {
                clearTimeout(fadeTimeout);
            }
            if (colorTimeout > 0 && colorTimeout != undefined) {
                clearTimeout(colorTimeout);
            }
            if (fadeinclass != undefined) {
                const fadeOut_toast = fadeinclass.children[0];
                fadeOutToast01(fadeOut_toast);
            }
            setTimeout(function (toast) {
                fadeInExeToast01(toast);
            }, 1500, toast);
        }
        else {
            fadeInExeToast01(toast);
        }
    }
    // フェードイン処理の実処理関数
    function fadeInExeToast01(toast) {
        // トースト表示（フェードイン）
        toast.parentElement.classList.add('c_toast01_fadeIn');
        // メソッド呼び出し時のみ対象とするため、SVGが2種存在しているかで判断
        if (toast.getElementsByClassName('c_iconAndText01_exclamation').length > 0 && toast.getElementsByClassName('c_iconAndText01_success').length > 0) {
            adjustbgcolorToast01(toast);
        }
        else {
            //iOS向け、値設定しないとブロック変数が読み取れないため必ず値を設定する
            colorTimeout = 0;
        }
        //トーストに「c_toast01_manual」のClassが存在しない場合のみ自動フェードアウト処理を実施
        if (!toast.parentElement.classList.contains('c_toast01_manual')) {
            fadeTimeout = setTimeout(function (toast) {
                // トースト非表示（フェードアウト）呼び出し
                fadeOutToast01(toast);
            }, 3000, toast);
        }
        else {
            //iOS向け、値設定しないとブロック変数が読み取れないため必ず値を設定する
            fadeTimeout = 0;
        }
    }
    //トースト背景色の初期化
    function clearColorToast(toast) {
        toast.classList.remove('c_toast01_blue');
        toast.classList.remove('c_toast01_green');
        toast.classList.remove('c_toast01_orange');
        toast.classList.remove('c_toast01_red');
    }
    //連続押下時の色変更を実施するための関数
    function adjustbgcolorToast01(toast) {
        const iconExcl = toast.getElementsByClassName('c_iconAndText01_exclamation')[0];
        const iconSuccess = toast.getElementsByClassName('c_iconAndText01_success')[0];
        // c_toast01_customがなければここで追加しておく
        if (!toast.classList.contains('c_toast01_custom')) {
            toast.classList.add('c_toast01_custom');
        }
        // Successの場合
        if (!iconSuccess.classList.contains('c_iconAndText01_hidden')) {
            //アイコン選択とカラーが異なっている場合の処理を実施
            if (!toast.classList.contains('c_toast01_green')) {
                clearColorToast(toast);
                toast.classList.add('c_toast01_green');
            }
        }
        // Success以外の場合
        else {
            //アイコン選択とカラーが異なっている場合の処理を実施
            if (iconExcl.classList.contains('c_iconAndText01_informative') && !toast.classList.contains('c_toast01_blue')) {
                clearColorToast(toast);
                toast.classList.add('c_toast01_blue');
            }
            if (iconExcl.classList.contains('c_iconAndText01_warning') && !toast.classList.contains('c_toast01_orange')) {
                clearColorToast(toast);
                toast.classList.add('c_toast01_orange');
            }

            if (iconExcl.classList.contains('c_iconAndText01_error') && !toast.classList.contains('c_toast01_red')) {
                clearColorToast(toast);
                toast.classList.add('c_toast01_red');
            }
        }
    }
    // トースト非表示（フェードアウト）
    function fadeOutToast01(toast) {
        // トースト表示（フェードイン）のクラスがある場合は処理を行う
        if (toast.parentElement.classList.contains('c_toast01_fadeIn')) {
            // トースト非表示（フェードアウト）
            toast.parentElement.classList.remove('c_toast01_fadeIn');
            if (!toast.classList.contains('c_toast01_fadeout')) {
                toast.parentElement.classList.add('c_toast01_fadeout');
            }

            colorTimeout = setTimeout(function (toast) {
                // 個別でトーストの種類を指定した場合はトーストの色のクラスをクリアする
                if (toast.classList.contains('c_toast01_custom')) {
                    toast.classList.remove('c_toast01_custom');
                    toast.classList.remove('c_toast01_blue');
                    toast.classList.remove('c_toast01_green');
                    toast.classList.remove('c_toast01_orange');
                    toast.classList.remove('c_toast01_red');
                }
                // トーストが完全に消えたら、busy状態を解除（トースト表示可能状態にする）
                toast.parentElement.classList.remove('c_toast01_fadeout');
            }, 1500, toast);
        }
        else {
            colorTimeout = 0;
        }
    }

    const showToast = document.getElementsByClassName('c_toast01_showToast');

    for (let i = 0; i < showToast.length; i++) {
        //トースト表示部品押下時
        showToast[i].addEventListener('click', function () {
            fadeInToast01(this);
        });
    }

    const closeBtn = document.getElementsByClassName('c_iconAndText01_closeIcon');

    for (let i = 0; i < closeBtn.length; i++) {
        //トーストの×アイコン押下時
        closeBtn[i].addEventListener('click', function () {
            // ×アイコン押下直後にトースト非表示（フェードアウト）
            fadeOutToast01(this.parentElement.parentElement);
        });

        // フォーカス対応
        closeBtn[i].addEventListener('keydown', function (e) {
            // クリックイベントの生成
            if (c_isbrowserIE()) {
                clickEvent = document.createEvent('Event');
                clickEvent.initEvent('click', false, true);
            } else {
                clickEvent = new Event('click');
            }

            // EnterキーもしくはSpace押下で該当項目を選択する
            // keyCode : "13" （Enter）
            if (e.keyCode == "13") {
                this.dispatchEvent(clickEvent);
            }
        });
    }


}

/** コンポーネント：Tooltip **/
if (!document.getElementsByClassName('c_tooltips').length) {
    //ツールチップがある場合のみ実施
} else {
    // テキストエリアの位置設定処理
    function setBalloon() {
        // ツールチップアイコン
        const tooltip = document.getElementsByClassName('c_tooltips01');
        for (let i = 0; i < tooltip.length; i++) {
            // 吹き出しのテキストエリア
            const textArea = tooltip[i].lastElementChild;
            // left初期化
            textArea.style.removeProperty('left');

            // テキストエリアの座標
            const textAreaRect = textArea.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            // テキストエリア左端のX座標座標
            const leftRect = textAreaRect.left + scrollLeft;
            // テキストエリア右端の座標取得
            const rightRect = textAreaRect.left + scrollLeft + textArea.offsetWidth;

            // 画面の横幅
            const screenWidth = document.documentElement.clientWidth;

            // 最小マージン(SP:20px、PC:32px)
            let margin;
            if (window.matchMedia('(max-width: 760px)').matches) {
                margin = 20;
            } else {
                margin = 32;
            }

            // テキストエリアの位置設定
            if (0 > leftRect) {
                // 左にはみ出している場合
                textArea.style.left = 'calc(50% + ' + (-(leftRect) + margin) + 'px)';
            } else if ((screenWidth - margin) < rightRect) {
                // 右にはみ出している場合
                textArea.style.left = 'calc(50% + ' + (-((rightRect - screenWidth) + margin)) + 'px)';
            }
        }
    }

    window.addEventListener('DOMContentLoaded', function () {
        // 吹き出しの位置設定（上下）
        // ツールチップ
        const tooltip = document.getElementsByClassName('c_tooltips01');
        for (let i = 0; i < tooltip.length; i++) {
            // ツールチップアイコンの高さ
            const IconHeight = tooltip[i].getElementsByClassName('c_tooltips01_icon')[0].offsetHeight;
            // 三角
            const triangle = tooltip[i].getElementsByClassName('c_tooltips01_triangle')[0];
            //　テキストエリア
            const textArea = tooltip[i].getElementsByClassName('c_tooltips01_textArea')[0];
            // 「アイコンと吹き出しのpadding」と「三角の高さ」の和
            const trianglHeight = 24;

            let IconSize = 0;
            let trianglePadding = 0;

            // 子要素の有無を確認して高さを取得する
            if (tooltip[i].getElementsByClassName('c_tooltips01_icon')[0].children[0]) {
                IconSize = tooltip[i].getElementsByClassName('c_tooltips01_icon')[0].children[0].getBoundingClientRect();
                // タップエリアからアイコンエリア、paddingの値を引いた数
                trianglePadding = (IconHeight - IconSize.height) - 8;
            }

            // テキストエリアと吹き出しの位置を設定
            if (tooltip[i].classList.contains('c_tooltips01_top')) {
                triangle.style.bottom = -(trianglHeight - trianglePadding) + 'px';
                textArea.style.top = (trianglHeight + IconHeight - trianglePadding) + 'px';
            } else {
                triangle.style.top = -(trianglHeight - trianglePadding) + 'px';
                textArea.style.bottom = (trianglHeight + IconHeight - trianglePadding) + 'px';
            }

            // ツールチップの大きさ指定
            const IconWidth = tooltip[i].getElementsByClassName('c_tooltips01_icon')[0].offsetWidth;
            tooltip[i].style.width = IconWidth + 'px';
        }
        setBalloon();
    })

    // リサイズ時
    window.addEventListener('resize', setBalloon);

    // クリックイベント
    const tooltip = document.getElementsByClassName('c_tooltips01');
    for (let i = 0; i < tooltip.length; i++) {
        // ツールチップクリック
        tooltip[i].addEventListener('click', function () {

            // 押下されたツールチップの表示・非表示処理
            if (this.classList.contains('c_tooltips01_hidden')) {
                // 非表示フラグが含まれる場合、他のツールチップを非表示
                if (this.classList.contains('c_tooltip_allHidden')) {
                    for (let j = 0; j < tooltip.length; j++) {
                        if (tooltip[j] != this) {
                            tooltip[j].classList.add('c_tooltips01_hidden');
                        }
                    }
                }
                this.classList.remove('c_tooltips01_hidden');
            } else {
                this.classList.add('c_tooltips01_hidden');
            }
        });
    }
}

/** コンポーネント：Radio03 **/
// ラジオボタンの取得
window.addEventListener('DOMContentLoaded', function () {
    const radioList = document.getElementsByClassName('c_radio03_unit');

    for (let i = 0; i < radioList.length; i++) {

        // キー操作が行われたら処理を実行
        radioList[i].children[1].addEventListener('keydown', function (e) {

            // EnterキーもしくはSpace押下で該当項目を選択する
            // keyCode : "13" （Enter）
            // keyCode : "32" （Space）
            if (e.keyCode == "13" || e.keyCode == "32") {
                this.previousElementSibling.checked = true;

                // チェンジイベントの発行
                let changeEvent;
                if (c_isbrowserIE()) {
                    // IE
                    changeEvent = document.createEvent('Event');
                    changeEvent.initEvent('change', false, false);
                } else {
                    // IE以外
                    changeEvent = new Event('change');
                }
                this.previousElementSibling.dispatchEvent(changeEvent);
            }
        });
    }
})

/** コンポーネント：CheckBox01 **/
// チェックボックスの取得
window.addEventListener('DOMContentLoaded', function () {

    const checkBoxList = document.getElementsByClassName('c_checkBox01_checkBox');

    for (let i = 0; i < checkBoxList.length; i++) {

        // キー操作が行われたら処理を実行
        checkBoxList[i].children[1].addEventListener('keydown', function (e) {

            // EnterキーもしくはSpace押下で該当項目を選択する
            // keyCode : "13" （Enter）
            // keyCode : "32" （Space）
            if (e.keyCode == "13" || e.keyCode == "32") {

                if (!this.parentElement.parentElement.classList.contains('c_checkBox01_disabled')) {

                    // チェックボックスのつけ外し
                    if (this.previousElementSibling.checked == true) {
                        this.previousElementSibling.checked = false;
                    } else {
                        this.previousElementSibling.checked = true;
                    }

                    // チェンジイベントの発行
                    let changeEvent;
                    if (c_isbrowserIE()) {
                        // IE
                        changeEvent = document.createEvent('Event');
                        changeEvent.initEvent('change', false, false);
                    } else {
                        // IE以外
                        changeEvent = new Event('change');
                    }
                    this.previousElementSibling.dispatchEvent(changeEvent);
                }
            }
        });

    }
})

// 以下はシステムパーツ集（storybook）未掲載またはold_global部品
/** コンポーネント：チェックボックスボタン **/
if (!document.getElementsByClassName('c_checkBoxBtn').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    // c_checkBox_jdgを取得する
    const checkjdg = document.getElementsByClassName('c_checkBox_jdg');
    for (let i = 0; i < checkjdg.length; i++) {
        checkjdg[i].addEventListener('change', function () {
            // c_checkBoxBtn内のc_button01を取得する
            const chkBoxBtn = this.parentElement.parentElement.getElementsByClassName('c_button01')[0];
            if (this.checked === true) {
                // ボタンが活性の場合
                chkBoxBtn.classList.remove('c_button01_disabled');
            } else {
                // ボタンが非活性の場合
                chkBoxBtn.classList.add('c_button01_disabled');
            }
        });
    }
}

/** コンポーネント：DotCarousel **/
if (!document.getElementsByClassName('c_dotCarousel_view').length) {
    // 該当の要素がない場合は処理を行わない
} else {

    let dots = document.getElementsByClassName('c_dotCarousel_dots');
    //どのドットが押下されたかの判定し左スクロールもしくは右スクロール
    for (let i = 0; i < dots.length; i++) {
        //どのドットが押下されたかの情報を持ってdotDistanceに飛ばす
        dots[i].addEventListener('click', function () {
            let dotList = this.parentElement.children;
            let cntThis;
            let cntAc;

            for (let i = 0; i < dotList.length; i++) {
                if (dotList[i] == this) {
                    //押下されたドットのインデックス数習得
                    cntThis = i;
                }
                if (dotList[i].classList.contains('c_dotCarousel_dotActive') == true) {
                    //現在アクティブなドットのインデックス数習得
                    cntAc = i;
                }
            }
            //押されたドットがアクティブドットより右に位置する場合は右→左にスクロール
            //押されたドットがアクティブドットより左に位置する場合は左→右にスクロール
            if (cntThis > cntAc) {
                //右スクロール処理に遷移
                rightToLeft(this.parentElement.parentElement.getElementsByClassName('c_dotCarousel_view')[0], cntThis);
            } else if (cntThis < cntAc) {
                //左スクロール処理に遷移
                leftToRight(this.parentElement.parentElement.getElementsByClassName('c_dotCarousel_view')[0], cntThis);
            }
        })
    }


    //タッチスライド、クリックスライドができる範囲
    let touchArea = document.getElementsByClassName('c_dotCarousel_view');
    let startX;               //タッチ開始　X座標
    let clickstartX;		  //クリック開始　X座標
    let moveX;                //スワイプ中のX座標
    let clickmoveX;		  	  //クリック中の　X座標
    let dist = 30             //スワイプを感知する最低距離（ピクセル単位）

    for (let i = 0; i < touchArea.length; i++) {

        // タッチ開始時：xy座標を取得
        touchArea[i].addEventListener('touchstart', function (e) {
            //デフォルトの動作をキャンセル
            e.preventDefault();
            startX = e.changedTouches[0].pageX;
            setTimeout(function (e) { }, 1000);
        });

        //クリック開始時：xy座標を取得
        touchArea[i].addEventListener('mousedown', function (e) {
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
        touchArea[i].addEventListener('touchmove', function (e) {
            //デフォルトの動作をキャンセル
            e.preventDefault();
            moveX = e.changedTouches[0].pageX;
            setTimeout(function (e) { }, 1000);
        });


        //スワイプ中: xy座標の取得
        touchArea[i].addEventListener('touchend', function (e) {
            //デフォルトの動作をキャンセル
            e.preventDefault();

            if (startX > moveX && startX > moveX + dist) {
                rightToLeft(this, -1);
            }
            else if (startX < moveX && startX + dist < moveX) {
                leftToRight(this, -1);
            }
            moveX = undefined;//初期化
        });

        //クリックスワイプ中: xy座標の取得
        touchArea[i].addEventListener('mouseup', function (e) {
            //デフォルトの動作をキャンセル
            e.preventDefault();
            clickmoveX = e.pageX;

            if (clickstartX > clickmoveX && clickstartX > clickmoveX + dist) {
                //IE対応為、thisでスライドするエリアの情報を送る
                rightToLeft(this, -1);
            }
            else if (clickstartX < clickmoveX && clickstartX + dist < clickmoveX) {
                //IE対応為、thisでスライドするエリアの情報を送る
                leftToRight(this, -1);
            }
            clickmoveX = undefined; //初期化
        });
    }

    //左から右にスクロール処理
    function leftToRight(targetElement, targetIndex) {
        const sliderList = targetElement.getElementsByClassName('c_dotCarousel_list');
        //transition中ならば処理しない
        if ((!targetElement.classList.contains('isMove1')) && (!targetElement.classList.contains('isMove2'))) {
            for (let i = 0; i < sliderList.length; i++) {
                //現在アクティブなスライドの特定
                if (sliderList[i].classList.contains('c_dotCarousel_active')) {
                    //現在アクティブなスライドが左端か判定
                    if (!i == 0) {

                        //transition終了時のイベントを登録する（その１）
                        sliderList[i].addEventListener('transitionend', tranEnd1);

                        //transitionen中のフラグを設定
                        targetElement.classList.add('isMove1');
                        targetElement.classList.add('isMove2');

                        //アクティブスライドを右にスライドする
                        sliderList[i].classList.add('c_dotCarousel_ActiveToRight');

                        //スワイプでのスライドか、ドットクリックでのスワイプか
                        if (targetIndex == -1) {

                            //transition終了時のイベントを登録する（その２）
                            sliderList[i - 1].addEventListener('transitionend', tranEnd2);
                            //アクティブスライドから左隣のスライドをアクティブに設定
                            sliderList[i - 1].classList.add('c_dotCarousel_moveAc');

                        } else {
                            //transition終了時のイベントを登録する（その２）
                            sliderList[targetIndex].addEventListener('transitionend', tranEnd2);
                            //押下されたドットの該当の箇所のスライドをアクティブに設定
                            sliderList[targetIndex].classList.add('c_dotCarousel_moveAc');
                        }
                        break;
                    }
                }
            }
        }
    }

    //右から左にスクロール処理
    function rightToLeft(targetElement, targetIndex) {
        const sliderList = targetElement.getElementsByClassName('c_dotCarousel_list')
        //アニメーション中のフラグがあるか確認
        if ((!targetElement.classList.contains('isMove1')) && (!targetElement.classList.contains('isMove2'))) {
            for (let i = 0; i < sliderList.length; i++) {
                //現在アクティブなスライドの特定
                if (sliderList[i].classList.contains('c_dotCarousel_active')) {
                    if (i != sliderList.length - 1) {

                        //transitionenが終わった場合処理を飛ばす
                        sliderList[i].addEventListener('transitionend', tranEnd1);

                        targetElement.classList.add('isMove1');
                        targetElement.classList.add('isMove2');

                        //アクティブスライドを左にスライドする
                        sliderList[i].classList.add('c_dotCarousel_ActiveToleft');

                        //スワイプでのスライドか、ドットクリックでのスワイプか
                        if (targetIndex == -1) {
                            sliderList[i + 1].addEventListener('transitionend', tranEnd3);
                            //アクティブスライドから右隣のスライドをアクティブに設定
                            sliderList[i + 1].classList.add('c_dotCarousel_moveAc');

                        } else {
                            sliderList[targetIndex].addEventListener('transitionend', tranEnd3);
                            //押下されたドットの該当の箇所のスライドをアクティブに設定
                            sliderList[targetIndex].classList.add('c_dotCarousel_moveAc');
                        }
                        break;
                    }
                }
            }
        }
    }

    //transition終了時　旧アクティブスライドの設定　transitionを削除
    function tranEnd1() {
        //transitionを設定しているクラスを削除
        if (this.classList.contains('c_dotCarousel_ActiveToleft')) {
            this.classList.add('c_dotCarousel_left');
            this.classList.remove('c_dotCarousel_ActiveToleft');
        }
        else if (this.classList.contains('c_dotCarousel_ActiveToRight')) {
            this.classList.add('c_dotCarousel_right');
            this.classList.remove('c_dotCarousel_ActiveToRight');
        }

        //アクティブの設定を削除
        this.classList.remove('c_dotCarousel_active');
        this.parentElement.parentElement.classList.remove('isMove1');
        //transitionendのイベントを削除
        this.removeEventListener('transitionend', tranEnd1);
    }

    //transition終了時　右からスライドした新規アクティブスライドの設定　transitionを削除
    function tranEnd2() {

        let sliderList = this.parentElement.children;
        this.classList.remove('c_dotCarousel_left');
        this.classList.add('c_dotCarousel_active');
        this.classList.remove('c_dotCarousel_moveAc');

        let flgRight = false;//アクティブスライドか判定用のFlg

        //押下されたドットよりに左に位置するスライドを全て左に配置する
        for (let i = 0; i < sliderList.length; i++) {
            if (sliderList[i] == this) {
                flgRight = true;
            } else if (flgRight) {
                //tranEnd1でもやっていることをあえて実施（ｄｏｔ処理での予期せぬ動きがあるため）
                sliderList[i].classList.add('c_dotCarousel_right');
                sliderList[i].classList.remove('c_dotCarousel_left');
                sliderList[i].classList.remove('c_dotCarousel_active');
            } else {
                sliderList[i].classList.add('c_dotCarousel_left');
                sliderList[i].classList.remove('c_dotCarousel_right');
                sliderList[i].classList.remove('c_dotCarousel_active');
            }
        }

        this.parentElement.parentElement.classList.remove('isMove2');
        this.removeEventListener('transitionend', tranEnd2);
        dotMove(this);
    }

    //transition終了時　左からスライドした新規アクティブスライドの設定　transitionを削除
    function tranEnd3() {

        const sliderList = this.parentElement.children;
        this.classList.remove('c_dotCarousel_right');
        this.classList.add('c_dotCarousel_active');
        this.classList.remove('c_dotCarousel_moveAc');

        let flgRight = false;//アクティブスライドか判定用のFlg

        //押下されたドットよりに左に位置するスライドを全て左に配置する
        for (let i = 0; i < sliderList.length; i++) {
            if (sliderList[i] == this) {
                flgRight = true;
            } else if (flgRight) {
                //tranEnd1でもやっていることをあえて実施（ｄｏｔ処理での予期せぬ動きがあるため）
                sliderList[i].classList.add('c_dotCarousel_right');
                sliderList[i].classList.remove('c_dotCarousel_left');
                sliderList[i].classList.remove('c_dotCarousel_active');
            } else {
                sliderList[i].classList.add('c_dotCarousel_left');
                sliderList[i].classList.remove('c_dotCarousel_right');
                sliderList[i].classList.remove('c_dotCarousel_active');
            }
        }

        //transitionフラグを削除
        this.parentElement.parentElement.classList.remove('isMove2');
        //transitionendのイベントを削除
        this.removeEventListener('transitionend', tranEnd3);
        dotMove(this);
    }

    //ActiveスライドとActiveドットの平仄を合わせる
    function dotMove(acSlide) {
        let sliderList = acSlide.parentElement.children;
        let dots = acSlide.parentElement.parentElement.parentElement.getElementsByClassName('c_dotCarousel_dots');

        for (let i = 0; i < sliderList.length; i++) {
            // Activeスライドのindex数に合わせてActiveドットを設定する
            if (sliderList[i].classList.contains('c_dotCarousel_active')) {
                dots[i].classList.add('c_dotCarousel_dotActive');
            } else {
                //アクティブドットの削除
                dots[i].classList.remove('c_dotCarousel_dotActive');
            }
        }
    }
}

/** コンポーネント：アローカルーセル **/
if (!document.getElementsByClassName('c_arrowCarousel').length) {
} else {
    // 対象のhtmlCollectionから指定したクラス名を持つ要素の最初のindexを返却する処理
    function getIndexByClass(targetList, targetClass) {
        let returnIndex;
        for (let i = 0; i < targetList.length; i++) {
            if (targetList[i].classList.contains(targetClass)) {
                returnIndex = i;
                break;
            }
        }
        return returnIndex;
    }

    // datasetのtargetIdを照合してコンテンツを切り替える処理
    function changeContent(targetContents, targetId, activeClassName) {
        for (let i = 0; i < targetContents.length; i++) {
            if (targetId == targetContents[i].dataset.target_id) {
                targetContents[i].classList.add(activeClassName);
            } else {
                targetContents[i].classList.remove(activeClassName);
            }
        }
    }

    // 矢印アイコンの活性非活性を設定する
    function setDisableArrowIcon(listLength, activeIndex, targetIconLeft, targetIconRight, disableClass) {
        if (activeIndex == 0) {
            // アクティブ要素が一番左にある時
            targetIconLeft.classList.add(disableClass);
        } else {
            targetIconLeft.classList.remove(disableClass);
        }
        if (activeIndex == listLength - 1) {
            // アクティブ要素が一番右にある時
            targetIconRight.classList.add(disableClass);
        } else {
            targetIconRight.classList.remove(disableClass);
        }
    }

    // 左の要素を右にスライド
    function moveLeftToRight(carouselArea) {
        // 子要素のitemリストを取得
        const carouselListItems = carouselArea.getElementsByClassName('c_arrowCarousel_item');
        // active要素のインデックスを取得
        const activeIndex = getIndexByClass(carouselListItems, 'c_arrowCarousel_active');
        // active要素のindexが一番左なら移動せずに処理終了
        if (activeIndex == 0) {
            return;
        }

        /*
        ■カルーセル移動処理
        active要素の3つ左の要素から順にクラスを付け替えて一つ一つ右に移動
        */
        // 場所ごとにクラス置換 ※classlistのreplaceがIE非対応のため、classNameをreplaceして文字列ごと置き換え
        // ３つ左（外側）の要素を２つ左に移動
        if (activeIndex - 3 >= 0) { carouselListItems[activeIndex - 3].className = carouselListItems[activeIndex - 3].className.replace('c_arrowCarousel_left-out', 'c_arrowCarousel_left-left') };
        // ２つ左の要素を１つ左に移動
        if (activeIndex - 2 >= 0) { carouselListItems[activeIndex - 2].className = carouselListItems[activeIndex - 2].className.replace('c_arrowCarousel_left-left', 'c_arrowCarousel_left') };
        // １つ左の要素をactiveに移動
        if (activeIndex - 1 >= 0) { carouselListItems[activeIndex - 1].className = carouselListItems[activeIndex - 1].className.replace('c_arrowCarousel_left', 'c_arrowCarousel_active') };
        // active要素を右に移動
        carouselListItems[activeIndex].className = carouselListItems[activeIndex].className.replace('c_arrowCarousel_active', 'c_arrowCarousel_right');
        // １つ右の要素を２つ右に移動
        if (activeIndex + 1 < carouselListItems.length) { carouselListItems[activeIndex + 1].className = carouselListItems[activeIndex + 1].className.replace('c_arrowCarousel_right', 'c_arrowCarousel_right-right') };
        // ２つ右の要素を３つ右（外側）に移動
        if (activeIndex + 2 < carouselListItems.length) { carouselListItems[activeIndex + 2].className = carouselListItems[activeIndex + 2].className.replace('c_arrowCarousel_right-right', 'c_arrowCarousel_right-out') };

        // 矢印アイコンの活性非活性切り替え
        setDisableArrowIcon(carouselListItems.length, activeIndex - 1,
            carouselArea.getElementsByClassName('c_arrowCarousel_arrowLeft')[0],
            carouselArea.getElementsByClassName('c_arrowCarousel_arrowRight')[0],
            'c_arrowCarousel_arrow_disable');

        // コンテンツを切り替え
        const targetContents = carouselArea.nextElementSibling.getElementsByClassName('c_arrowCarousel_content');
        changeContent(targetContents, carouselListItems[activeIndex - 1].dataset.target_id, 'c_arrowCarousel_content_active');
    }

    // 右の要素を左にスライド
    function moveRightToLeft(carouselArea) {
        // 子要素のitemリストを取得
        const carouselListItems = carouselArea.getElementsByClassName('c_arrowCarousel_item');
        // active要素のインデックスを取得
        const activeIndex = getIndexByClass(carouselListItems, 'c_arrowCarousel_active');
        // active要素のindexが一番右なら移動せずに処理終了
        if (activeIndex >= carouselListItems.length - 1) {
            return;
        }
        /*
        ■カルーセル移動処理
        active要素の3つ右の要素から順にクラスを付け替えて一つ一つ左に移動
        */
        // 場所ごとにクラス置換 ※classlistのreplaceがIE非対応のため、classNameをreplaceして文字列ごと置き換え
        // ３つ右（外側）の要素を２つ右に移動
        if (activeIndex + 3 < carouselListItems.length) { carouselListItems[activeIndex + 3].className = carouselListItems[activeIndex + 3].className.replace('c_arrowCarousel_right-out', 'c_arrowCarousel_right-right') };
        // ２つ右の要素を１つ右に移動
        if (activeIndex + 2 < carouselListItems.length) { carouselListItems[activeIndex + 2].className = carouselListItems[activeIndex + 2].className.replace('c_arrowCarousel_right-right', 'c_arrowCarousel_right') };
        // １つ左の要素をactiveに移動
        if (activeIndex + 1 < carouselListItems.length) { carouselListItems[activeIndex + 1].className = carouselListItems[activeIndex + 1].className.replace('c_arrowCarousel_right', 'c_arrowCarousel_active') };
        // active要素を左に移動
        carouselListItems[activeIndex].className = carouselListItems[activeIndex].className.replace('c_arrowCarousel_active', 'c_arrowCarousel_left');
        // １つ左の要素を２つ左に移動
        if (activeIndex - 1 >= 0) { carouselListItems[activeIndex - 1].className = carouselListItems[activeIndex - 1].className.replace('c_arrowCarousel_left', 'c_arrowCarousel_left-left') };
        // ２つ左の要素を３つ左に移動
        if (activeIndex - 2 >= 0) { carouselListItems[activeIndex - 2].className = carouselListItems[activeIndex - 2].className.replace('c_arrowCarousel_left-left', 'c_arrowCarousel_left-out') };

        // 矢印アイコンの活性非活性切り替え
        setDisableArrowIcon(carouselListItems.length, activeIndex + 1,
            carouselArea.getElementsByClassName('c_arrowCarousel_arrowLeft')[0],
            carouselArea.getElementsByClassName('c_arrowCarousel_arrowRight')[0],
            'c_arrowCarousel_arrow_disable');

        // コンテンツを切り替え
        const targetContents = carouselArea.nextElementSibling.getElementsByClassName('c_arrowCarousel_content');
        changeContent(targetContents, carouselListItems[activeIndex + 1].dataset.target_id, 'c_arrowCarousel_content_active');
    }

    // 矢印アイコンにイベント登録
    const arrowLefts = document.getElementsByClassName('c_arrowCarousel_arrowLeft')
    for (let i = 0; i < arrowLefts.length; i++) {
        arrowLefts[i].addEventListener('click', function () {
            // c_arrowCarousel_areaを引数にする
            moveLeftToRight(this.parentElement.parentElement);
        })
    };
    const arrowRights = document.getElementsByClassName('c_arrowCarousel_arrowRight')
    for (let i = 0; i < arrowRights.length; i++) {
        arrowRights[i].addEventListener('click', function () {
            // c_arrowCarousel_areaを引数にする
            moveRightToLeft(this.parentElement.parentElement);
        })
    };

    // 画面表示時の初期設定
    function setInitCarousel() {
        // active要素の前後にクラス付与
        const carousels = document.getElementsByClassName('c_arrowCarousel');
        for (let i = 0; i < carousels.length; i++) {
            // carouselItemsを取得
            const carouselListItems = carousels[i].getElementsByClassName('c_arrowCarousel_item');
            // activeのindex取得
            const activeIndex = getIndexByClass(carouselListItems, 'c_arrowCarousel_active');
            // active前後の要素にクラス付与
            for (let i = 0; i < carouselListItems.length; i++) {
                if (i < activeIndex - 2) { carouselListItems[i].classList.add('c_arrowCarousel_left-out'); };
                if (i == activeIndex - 2) { carouselListItems[i].classList.add('c_arrowCarousel_left-left'); };
                if (i == activeIndex - 1) { carouselListItems[i].classList.add('c_arrowCarousel_left'); };
                if (i == activeIndex + 1) { carouselListItems[i].classList.add('c_arrowCarousel_right'); };
                if (i == activeIndex + 2) { carouselListItems[i].classList.add('c_arrowCarousel_right-right'); };
                if (i > activeIndex + 2) { carouselListItems[i].classList.add('c_arrowCarousel_right-out'); };
            }

            // 矢印アイコンの活性非活性切り替え
            setDisableArrowIcon(carouselListItems.length, activeIndex,
                carousels[i].getElementsByClassName('c_arrowCarousel_arrowLeft')[0],
                carousels[i].getElementsByClassName('c_arrowCarousel_arrowRight')[0],
                'c_arrowCarousel_arrow_disable');

            // active要素に該当するコンテンツをactiveにする
            const carouselContents = carousels[i].getElementsByClassName('c_arrowCarousel_content');
            for (let i = 0; i < carouselContents.length; i++) {
                if (carouselContents[i].dataset.target_id == carouselListItems[activeIndex].dataset.target_id) {
                    carouselContents[i].classList.add('c_arrowCarousel_content_active');
                    break;
                }
            }
        }
    }
    // DomContentloadedに処理登録
    window.addEventListener('DOMContentLoaded', setInitCarousel);

    //タッチスライド、クリックスライドができる範囲
    const touchArea = document.getElementsByClassName('c_arrowCarousel_area');
    let startX;               //タッチ開始　X座標
    let clickstartX;		  //クリック開始　X座標
    let moveX;                //スワイプ中のX座標
    let clickmoveX;		  	  //クリック中の　X座標
    let dist = 30             //スワイプを感知する最低距離（ピクセル単位）

    for (let i = 0; i < touchArea.length; i++) {

        // タッチ開始時：xy座標を取得
        touchArea[i].addEventListener('touchstart', function (e) {
            //デフォルトの動作をキャンセル
            e.stopPropagation();
            startX = e.changedTouches[0].pageX;
            setTimeout(function (e) { }, 1000);
        });

        //クリック開始時：xy座標を取得
        touchArea[i].addEventListener('mousedown', function (e) {
            //デフォルトの動作をキャンセル
            e.stopPropagation();
            if (e.buttons == 1) {
                clickstartX = e.pageX;
                setTimeout(function (e) { }, 1000);
            }
            else {
                return false;
            }
        });

        // スワイプ開始時：xy座標を取得
        touchArea[i].addEventListener('touchmove', function (e) {
            //デフォルトの動作をキャンセル
            e.preventDefault();
            moveX = e.changedTouches[0].pageX;
            setTimeout(function (e) { }, 1000);
        });

        //スワイプ中: xy座標の取得
        touchArea[i].addEventListener('touchend', function (e) {
            //デフォルトの動作をキャンセル
            e.stopPropagation();

            if (startX > moveX && startX > moveX + dist) {
                moveRightToLeft(this);
            }
            else if (startX < moveX && startX + dist < moveX) {
                moveLeftToRight(this);
            }
            moveX = undefined;//初期化
        });

        //クリックスワイプ中: xy座標の取得
        touchArea[i].addEventListener('mouseup', function (e) {
            //デフォルトの動作をキャンセル
            e.stopPropagation();
            clickmoveX = e.pageX;

            if (clickstartX > clickmoveX && clickstartX > clickmoveX + dist) {
                //IE対応為、thisでスライドするエリアの情報を送る
                moveRightToLeft(this);
            }
            else if (clickstartX < clickmoveX && clickstartX + dist < clickmoveX) {
                //IE対応為、thisでスライドするエリアの情報を送る
                moveLeftToRight(this);
            }
            clickmoveX = undefined; //初期化
        });
    }
}

/** コンポーネント：クーポン **/
if (!document.getElementsByClassName('c_coupon01').length) {
} else {
    const textArea = document.getElementsByClassName('c_coupon01_textArea');

    for (let i = 0; i < textArea.length; i++) {

        textArea[i].addEventListener('click', function () {
            const clipword = this.getElementsByClassName('c_coupon01_typo_main')[0].innerText;
            if (navigator.clipboard == undefined) {
                // IEの場合は以下で処理
                window.clipboardData.setData('Text', clipword.trim());
            } else {
                // IE以外の場合は以下で処理
                navigator.clipboard.writeText(clipword);
            }
        });
    }
}

/** コンポーネント：Radio **/
// ラジオボタン（エラー時）
if (!document.getElementsByClassName('c_radio').length) {
    //該当の要素がない場合は処理を行なわない
} else {
    const errorflag = document.getElementsByClassName('c_radio');
    for (let i = 0; i < errorflag.length; i++) {
        const radiobtn = errorflag[i].getElementsByClassName('c_radio_input');
        for (let j = 0; j < radiobtn.length; j++) {
            radiobtn[j].addEventListener('click', function () {
                this.parentElement.parentElement.classList.remove('c_radio_errorFlag');
            })
        }
    };
}
// ナビゲーションがある場合のみ処理を実施する
if (!document.getElementsByClassName('c_myhNav01').length) {

}
else {
    /** ナビゲーション ： Navigation **/
    function HeaderLinkMenuOpenClick(target) {
        target.getElementsByClassName('c_myhNav01_MenuOpen')[0].classList.add("c_myhNav01_sphidden");
        target.getElementsByClassName('c_myhNav01_MenuClose')[0].classList.remove("c_myhNav01_sphidden");
        target.getElementsByClassName('c_myhNav01_MenuLinksArea')[0].classList.remove("c_myhNav01_sphidden");
    }
    function HeaderLinkMenuCloseClick(target) {
        target.getElementsByClassName('c_myhNav01_MenuOpen')[0].classList.remove("c_myhNav01_sphidden");
        target.getElementsByClassName('c_myhNav01_MenuClose')[0].classList.add("c_myhNav01_sphidden");
        target.getElementsByClassName('c_myhNav01_MenuLinksArea')[0].classList.add("c_myhNav01_sphidden");
    }

    const navHeader = document.getElementsByClassName('c_myhNav01');
    for (let i = 0; i < navHeader.length; i++) {
        // ハンバーガーメニューを開くための要素取得（ナビゲーション内では一意のclass名となるため配列0番目を取得）
        const navMenuOpen = navHeader[i].getElementsByClassName('c_myhNav01_MenuOpen')[0];
        // ハンバーガーメニューを閉じるための要素取得（ナビゲーション内では一意のclass名となるため配列0番目を取得）
        const navMenuClose = navHeader[i].getElementsByClassName('c_myhNav01_MenuClose')[0];
        // クリック時にメニューを開く処理を実施
        navMenuOpen.addEventListener('click', function () {
            HeaderLinkMenuOpenClick(this.parentElement.parentElement.parentElement);
        });
        // クリック時にメニューを閉じる処理を実施
        navMenuClose.addEventListener('click', function () {
            HeaderLinkMenuCloseClick(this.parentElement.parentElement.parentElement);
        });
    }
}
