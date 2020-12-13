import jQuery from "jquery";
import $ from "jquery";
import { getAPIVersion } from "../api/NTAPI";
import { addModule, deleteModule, isDirty, markDirty } from "./codeload";
import { closepop, popinfo } from "./popinfo";
import { GMGetValue, GMSetValue, setWindowProperty } from "./usfunc";
function createBtn(): void {
  jQuery(() => {
    $("ul.user_info_menu_btn").append(
      "<li><a href='https://www.mcbbs.net/home.php?mod=spacecp&bbsmod=manager'>MCBBS 模块管理</a></li>"
    );
  });
}
function createMenu(): void {
  if (
    String(window.location).startsWith(
      "https://www.mcbbs.net/home.php?mod=spacecp"
    )
  ) {
    jQuery(() => {
      $("div.appl > div.tbn > ul").prepend(
        "<li><a href='https://www.mcbbs.net/home.php?mod=spacecp&bbsmod=manager' style='cursor:pointer;'>模块管理</a></li>"
      );
    });
  }
}
function dumpManager() {
  jQuery(() => {
    $("div[class='bm bw0']").children().remove();
    $("div[class='bm bw0']").append(
      `<span style='font-size:1.5rem'>模块管理&nbsp;&nbsp;&nbsp;版本&nbsp;${getAPIVersion()}&nbsp<font size="2em" color="red">${
        isDirty() ? "当前的设置需要刷新才能生效" : ""
      }</font></span>
<br/>
<hr/>
<span style='font-size:1rem'>已安装的模块</span>
<br/>
<div style='overflow:auto;'><ul id='all_modules'></ul></div>
<hr/>
<span style='font-size:1rem'>安装新模块</span>
<br/>
<textarea style="font-family:'Fira Code','Courier New',monospace;background-color:#fbf2db;width:100%;height:150px;overflow:auto;word-break:break-all;resize:vertical;" placeholder='BASE64 编码，URL 或 JavaScript 代码……' id='install_base64'></textarea>
<br/>
<ul><li>访问 GitHub 资源可用 jsDelivr：https://cdn.jsdelivr.net/gh/你的用户名/你的仓库@分支（一般为 master 或 main）/仓库内文件路径</li></ul>
<br/>
<button class='pn pnc' type='button' id='install'><strong>安装</strong></button>
<br/>
<span id='install_state' style='font-size:1rem;color:#df307f;'></span>`
    );
    $("#install_base64").val(
      "/* MCBBS Module\nid = com.example\n*/\n// https://cdn.jsdelivr.net/gh/用户名/仓库@分支/文件.js"
    );
    setWindowProperty("notifyUninstall", (id: string) => {
      deleteModule(id, () => {
        dumpManager();
        popinfo("trash", "成功移除了模块", false);
        setTimeout(closepop, 3000);
      });
    });
    setWindowProperty("notifyOnOff", (id: string) => {
      if (GMGetValue("loader.all", {})[id]) {
        var all = GMGetValue("loader.all", {});

        all[id] = false;

        GMSetValue("loader.all", all);
      } else {
        var all = GMGetValue("loader.all", {});
        all[id] = true;
        GMSetValue("loader.all", all);
      }
      markDirty();
      dumpManager();
    });
    $("#install").on("click", () => {
      var str = $("#install_base64").val()?.toString() || "";
      try {
        var x = atob(str);
        var st = addModule(x);
        if (typeof st != "string") {
          dumpManager();
          $("#install_base64").val(GMGetValue(`code-${st.get("id")}`, ""));

          if (
            st.get("permissions")?.search("loader:core") != -1 &&
            st.get("permissions")?.search("loader:core") != undefined
          ) {
            popinfo(
              "exclamation-triangle",
              "您安装了一个 CoreMod，请当心，CoreMod 拥有很高的权限，可能会破坏 MCBBS Loader。如果这不是您安装的，请移除它：" +
                st.get("id") +
                "。",
              false,
              "background-color:#ff950085 !important;"
            );
          } else {
            popinfo("check", "成功安装了模块", false);
            setTimeout(closepop, 3000);
            return;
          }
        } else {
          popinfo("exclamation-circle", "安装失败：" + st, false);
          setTimeout(closepop, 5000);
        }
      } catch {
        var isUrlRegex = /^((file|https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/g;
        if (isUrlRegex.test(str)) {
          popinfo("cloud", "正在获取数据……");
          try {
            $.get(str, (dataIn) => {
              try {
                var data = dataIn.toString();
                if (typeof data === "string") {
                  var st = addModule(data);
                  if (typeof st != "string") {
                    dumpManager();
                    $("#install_base64").val(
                      GMGetValue(`code-${st.get("id")}`, "")
                    );

                    if (
                      st.get("permissions")?.search("loader:core") != -1 &&
                      st.get("permissions")?.search("loader:core") != undefined
                    ) {
                      popinfo(
                        "exclamation-triangle",
                        "您安装了一个 CoreMod，请当心，CoreMod 拥有很高的权限，可能会破坏 MCBBS Loader。如果这不是您安装的，请移除它：" +
                          st.get("id") +
                          "。",
                        false,
                        "background-color:#ff950085 !important;"
                      );
                    } else {
                      popinfo("check", "成功安装了模块", false);
                      setTimeout(closepop, 3000);
                      return;
                    }
                  } else {
                    popinfo(
                      "exclamation-circle",
                      "安装失败：" + st,
                      false,
                      "background-color:#88272790!important;"
                    );
                    setTimeout(closepop, 5000);
                  }
                } else {
                  popinfo(
                    "exclamation-circle",
                    "安装失败，接收了一个无效数据值",
                    false,
                    "background-color:#88272790!important;"
                  );
                  setTimeout(closepop, 5000);
                }
              } catch {
                popinfo(
                  "exclamation-circle",
                  "安装失败，接收了一个无效数据值",
                  false,
                  "background-color:#88272790!important;"
                );
                setTimeout(closepop, 5000);
              }
            });
          } catch {
            popinfo(
              "exclamation-circle",
              "安装失败，接收了一个无效数据值",
              false,
              "background-color:#88272790!important;"
            );
            setTimeout(closepop, 5000);
          }
        } else {
          var st = addModule(str);
          if (typeof st != "string") {
            dumpManager();
            $("#install_base64").val(GMGetValue(`code-${st.get("id")}`, ""));

            if (
              st.get("permissions")?.search("loader:core") != -1 &&
              st.get("permissions")?.search("loader:core") != undefined
            ) {
              popinfo(
                "exclamation-triangle",
                "您安装了一个 CoreMod，请当心，CoreMod 拥有很高的权限，可能会破坏 MCBBS Loader。如果这不是您安装的，请移除它：" +
                  st.get("id") +
                  "。",
                false,
                "background-color:#ff950085 !important;"
              );
            } else {
              popinfo("check", "成功安装了模块", false);
              setTimeout(closepop, 3000);
              return;
            }
          } else {
            popinfo(
              "exclamation-circle",
              "安装失败：" + st,
              false,
              "background-color:#88272790!important;"
            );
            setTimeout(closepop, 5000);
          }
        }
      }
    });
    var all_modules = GMGetValue("loader.all", {});
    for (var m of Object.entries(all_modules)) {
      var meta = GMGetValue("meta-" + m[0], { id: "impossible" });
      var color = "";
      var isCore = false;
      if (meta.permissions.search("loader:core") != -1) {
        color = "#ff0000";
        isCore = true;
      } else {
        color = "#5d2391";
      }
      var ele = `<li id='${
        meta.id || "impossible"
      }'><div style='display:inline;'><img src='${
        meta.icon || ""
      }' width='50' height='50' style="vertical-align:middle;float:left;"></img><div style="height: 8em">&nbsp;&nbsp;<span style='font-size:18px;color:${color}'><strong>${
        meta.name || "Nameless"
      }</strong></span>&nbsp;&nbsp;&nbsp;<span style='font-size:12px;color:#150029;'>${
        meta.id || "loader.nameless"
      }@${
        meta.version ||
        "1.0.0" +
          (isCore
            ? "&nbsp;<span style='color:#ff0000'><b>[COREMOD]</b></span>"
            : "")
      }</span><br/>&nbsp;&nbsp;<span style='font-size:16px;color:#df307f;'>${
        meta.author || "Someone"
      }</span><br/>&nbsp;&nbsp;<span style='font-size:12px'>${
        meta.description
      }</span><button style='float:right;' type='button' class='pn pnc remove' onclick='window.notifyUninstall("${
        meta.id
      }")'><strong>删除模块</strong></button>&nbsp;&nbsp;<button style='float:right;' type='button' class='pn pnc onoff' onclick='window.notifyOnOff("${
        meta.id
      }")'><strong>${
        GMGetValue("loader.all", {})[meta.id] ? "禁用" : "启用"
      }</strong></button><button type='button' style='float:right;' class='pn pnc showsrc' mlsource='${
        meta.id
      }'><strong>查看源代码</strong></button></div></div></li>`;
      $("#all_modules").append(ele);
      $(".showsrc").on("click", (e) => {
        var id =
          $(e.target).attr("mlsource") || $(e.target).parent().attr("mlsource");
        if (!id) {
          return;
        }
        $("#install_base64").val(GMGetValue(`code-${id}`, ""));
      });
    }
  });
}

export default { createBtn, createMenu, dumpManager };