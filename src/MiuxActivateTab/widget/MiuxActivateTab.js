define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "MiuxActivateTab/lib/jquery-1.11.2",

], function(declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery)
{
    "use strict";

    var $ = _jQuery.noConflict(true);

    function isElementVisible(el)
    {
        var rect = el.getBoundingClientRect(),
            vWidth = window.innerWidth || doc.documentElement.clientWidth,
            vHeight = window.innerHeight || doc.documentElement.clientHeight,
            efp = function(x, y)
            {
                return document.elementFromPoint(x, y)
            };

        // Return false if it's not in the viewport
        if(rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight)
        {
            return false;
        }

        // Return true if any of its four corners are visible
        return (
            el.contains(efp(rect.left, rect.top))
            || el.contains(efp(rect.right, rect.top))
            || el.contains(efp(rect.right, rect.bottom))
            || el.contains(efp(rect.left, rect.bottom))
        );
    }

    return declare("MiuxActivateTab.widget.MiuxActivateTab", [_WidgetBase], {


        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function()
        {
            this._handles = [];
        },

        postCreate: function()
        {
            logger.debug(this.id + ".postCreate");
        },

        update: function(obj, callback)
        {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._updateRendering(callback);

            const $menuItems = $('.' + this.targetClassName + ' li');

            const handle = setInterval(function()
                {
                    if(isElementVisible($menuItems.eq(0)[0]))
                    {
                        $menuItems.eq(0).addClass('active');

                        clearInterval(handle);
                    }
                },
                50);
        },

        resize: function(box)
        {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function()
        {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function(callback)
        {
            logger.debug(this.id + "._updateRendering");

            if(this._contextObj !== null)
            {
                dojoStyle.set(this.domNode, "display", "block");
            }
            else
            {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function(mf, guid, cb)
        {
            logger.debug(this.id + "._execMf");
            if(mf && guid)
            {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function(objs)
                    {
                        if(cb && typeof cb === "function")
                        {
                            cb(objs);
                        }
                    }),
                    error: function(error)
                    {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function(cb, from)
        {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if(cb && typeof cb === "function")
            {
                cb();
            }
        }
    });
});

require(["MiuxActivateTab/widget/MiuxActivateTab"]);
