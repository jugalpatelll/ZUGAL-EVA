import $ from 'jquery'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Alert = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'alert'
  const VERSION             = '4.0.0'
  const DATA_KEY            = 'bs.alert'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 150

  const Selector = {
    DISMISS : '[data-dismiss="alert"]'
  }

  const Event = {
    CLOSE          : `close${EVENT_KEY}`,
    CLOSED         : `closed${EVENT_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    ALERT : 'alert',
    FADE  : 'fade',
    SHOW  : 'show'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert {
    constructor(element) {
      this._element = element
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    // Public

    close(element) {
      element = element || this._element

      const rootElement = this._getRootElement(element)
      const customEvent = this._triggerCloseEvent(rootElement)

      if (customEvent.isDefaultPrevented()) {
        return
      }

      this._removeElement(rootElement)
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }

    // Private

    _getRootElement(element) {
      const selector = Util.getSelectorFromElement(element)
      let parent     = false

      if (selector) {
        parent = $(selector)[0]
      }

      if (!parent) {
        parent = $(element).closest(`.${ClassName.ALERT}`)[0]
      }

      return parent
    }

    _triggerCloseEvent(element) {
      const closeEvent = $.Event(Event.CLOSE)

      $(element).trigger(closeEvent)
      return closeEvent
    }

    _removeElement(element) {
      $(element).removeClass(ClassName.SHOW)

      if (!Util.supportsTransitionEnd() ||
          !$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element)
        return
      }

      $(element)
        .one(Util.TRANSITION_END, (event) => this._destroyElement(element, event))
        .emulateTransitionEnd(TRANSITION_DURATION)
    }

    _destroyElement(element) {
      $(element)
        .detach()
        .trigger(Event.CLOSED)
        .remove()
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $(this)
        let data       = $element.data(DATA_KEY)

        if (!data) {
          data = new Alert(this)
          $element.data(DATA_KEY, data)
        }

        if (config === 'close') {
          data[config](this)
        }
      })
    }

    static _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault()
        }

        alertInstance.close(this)
      }
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(
    Event.CLICK_DATA_API,
    Selector.DISMISS,
    Alert._handleDismiss(new Alert())
  )

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Alert._jQueryInterface
  $.fn[NAME].Constructor = Alert
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Alert._jQueryInterface
  }

  return Alert
})($)

export default Alert




import $ from 'jquery'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Button = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'button'
  const VERSION             = '4.0.0'
  const DATA_KEY            = 'bs.button'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]

  const ClassName = {
    ACTIVE : 'active',
    BUTTON : 'btn',
    FOCUS  : 'focus'
  }

  const Selector = {
    DATA_TOGGLE_CARROT : '[data-toggle^="button"]',
    DATA_TOGGLE        : '[data-toggle="buttons"]',
    INPUT              : 'input',
    ACTIVE             : '.active',
    BUTTON             : '.btn'
  }

  const Event = {
    CLICK_DATA_API      : `click${EVENT_KEY}${DATA_API_KEY}`,
    FOCUS_BLUR_DATA_API : `focus${EVENT_KEY}${DATA_API_KEY} ` +
                            `blur${EVENT_KEY}${DATA_API_KEY}`
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button {
    constructor(element) {
      this._element = element
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    // Public

    toggle() {
      let triggerChangeEvent = true
      let addAriaPressed = true
      const rootElement = $(this._element).closest(
        Selector.DATA_TOGGLE
      )[0]

      if (rootElement) {
        const input = $(this._element).find(Selector.INPUT)[0]

        if (input) {
          if (input.type === 'radio') {
            if (input.checked &&
              $(this._element).hasClass(ClassName.ACTIVE)) {
              triggerChangeEvent = false
            } else {
              const activeElement = $(rootElement).find(Selector.ACTIVE)[0]

              if (activeElement) {
                $(activeElement).removeClass(ClassName.ACTIVE)
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') ||
              rootElement.hasAttribute('disabled') ||
              input.classList.contains('disabled') ||
              rootElement.classList.contains('disabled')) {
              return
            }
            input.checked = !$(this._element).hasClass(ClassName.ACTIVE)
            $(input).trigger('change')
          }

          input.focus()
          addAriaPressed = false
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed',
          !$(this._element).hasClass(ClassName.ACTIVE))
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(ClassName.ACTIVE)
      }
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)

        if (!data) {
          data = new Button(this)
          $(this).data(DATA_KEY, data)
        }

        if (config === 'toggle') {
          data[config]()
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document)
    .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
      event.preventDefault()

      let button = event.target

      if (!$(button).hasClass(ClassName.BUTTON)) {
        button = $(button).closest(Selector.BUTTON)
      }

      Button._jQueryInterface.call($(button), 'toggle')
    })
    .on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
      const button = $(event.target).closest(Selector.BUTTON)[0]
      $(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type))
    })

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Button._jQueryInterface
  $.fn[NAME].Constructor = Button
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Button._jQueryInterface
  }

  return Button
})($)

export default Button


import $ from 'jquery'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Carousel = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                   = 'carousel'
  const VERSION                = '4.0.0'
  const DATA_KEY               = 'bs.carousel'
  const EVENT_KEY              = `.${DATA_KEY}`
  const DATA_API_KEY           = '.data-api'
  const JQUERY_NO_CONFLICT     = $.fn[NAME]
  const TRANSITION_DURATION    = 600
  const ARROW_LEFT_KEYCODE     = 37 // KeyboardEvent.which value for left arrow key
  const ARROW_RIGHT_KEYCODE    = 39 // KeyboardEvent.which value for right arrow key
  const TOUCHEVENT_COMPAT_WAIT = 500 // Time for mouse compat events to fire after touch

  const Default = {
    interval : 5000,
    keyboard : true,
    slide    : false,
    pause    : 'hover',
    wrap     : true
  }

  const DefaultType = {
    interval : '(number|boolean)',
    keyboard : 'boolean',
    slide    : '(boolean|string)',
    pause    : '(string|boolean)',
    wrap     : 'boolean'
  }

  const Direction = {
    NEXT     : 'next',
    PREV     : 'prev',
    LEFT     : 'left',
    RIGHT    : 'right'
  }

  const Event = {
    SLIDE          : `slide${EVENT_KEY}`,
    SLID           : `slid${EVENT_KEY}`,
    KEYDOWN        : `keydown${EVENT_KEY}`,
    MOUSEENTER     : `mouseenter${EVENT_KEY}`,
    MOUSELEAVE     : `mouseleave${EVENT_KEY}`,
    TOUCHEND       : `touchend${EVENT_KEY}`,
    LOAD_DATA_API  : `load${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    CAROUSEL : 'carousel',
    ACTIVE   : 'active',
    SLIDE    : 'slide',
    RIGHT    : 'carousel-item-right',
    LEFT     : 'carousel-item-left',
    NEXT     : 'carousel-item-next',
    PREV     : 'carousel-item-prev',
    ITEM     : 'carousel-item'
  }

  const Selector = {
    ACTIVE      : '.active',
    ACTIVE_ITEM : '.active.carousel-item',
    ITEM        : '.carousel-item',
    NEXT_PREV   : '.carousel-item-next, .carousel-item-prev',
    INDICATORS  : '.carousel-indicators',
    DATA_SLIDE  : '[data-slide], [data-slide-to]',
    DATA_RIDE   : '[data-ride="carousel"]'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Carousel {
    constructor(element, config) {
      this._items             = null
      this._interval          = null
      this._activeElement     = null

      this._isPaused          = false
      this._isSliding         = false

      this.touchTimeout       = null

      this._config            = this._getConfig(config)
      this._element           = $(element)[0]
      this._indicatorsElement = $(this._element).find(Selector.INDICATORS)[0]

      this._addEventListeners()
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }

    // Public

    next() {
      if (!this._isSliding) {
        this._slide(Direction.NEXT)
      }
    }

    nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden &&
        ($(this._element).is(':visible') && $(this._element).css('visibility') !== 'hidden')) {
        this.next()
      }
    }

    prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV)
      }
    }

    pause(event) {
      if (!event) {
        this._isPaused = true
      }

      if ($(this._element).find(Selector.NEXT_PREV)[0] &&
        Util.supportsTransitionEnd()) {
        Util.triggerTransitionEnd(this._element)
        this.cycle(true)
      }

      clearInterval(this._interval)
      this._interval = null
    }

    cycle(event) {
      if (!event) {
        this._isPaused = false
      }

      if (this._interval) {
        clearInterval(this._interval)
        this._interval = null
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval(
          (document.visibilityState ? this.nextWhenVisible : this.next).bind(this),
          this._config.interval
        )
      }
    }

    to(index) {
      this._activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0]

      const activeIndex = this._getItemIndex(this._activeElement)

      if (index > this._items.length - 1 || index < 0) {
        return
      }

      if (this._isSliding) {
        $(this._element).one(Event.SLID, () => this.to(index))
        return
      }

      if (activeIndex === index) {
        this.pause()
        this.cycle()
        return
      }

      const direction = index > activeIndex
        ? Direction.NEXT
        : Direction.PREV

      this._slide(direction, this._items[index])
    }

    dispose() {
      $(this._element).off(EVENT_KEY)
      $.removeData(this._element, DATA_KEY)

      this._items             = null
      this._config            = null
      this._element           = null
      this._interval          = null
      this._isPaused          = null
      this._isSliding         = null
      this._activeElement     = null
      this._indicatorsElement = null
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default,
        ...config
      }
      Util.typeCheckConfig(NAME, config, DefaultType)
      return config
    }

    _addEventListeners() {
      if (this._config.keyboard) {
        $(this._element)
          .on(Event.KEYDOWN, (event) => this._keydown(event))
      }

      if (this._config.pause === 'hover') {
        $(this._element)
          .on(Event.MOUSEENTER, (event) => this.pause(event))
          .on(Event.MOUSELEAVE, (event) => this.cycle(event))
        if ('ontouchstart' in document.documentElement) {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          $(this._element).on(Event.TOUCHEND, () => {
            this.pause()
            if (this.touchTimeout) {
              clearTimeout(this.touchTimeout)
            }
            this.touchTimeout = setTimeout((event) => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval)
          })
        }
      }
    }

    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault()
          this.prev()
          break
        case ARROW_RIGHT_KEYCODE:
          event.preventDefault()
          this.next()
          break
        default:
      }
    }

    _getItemIndex(element) {
      this._items = $.makeArray($(element).parent().find(Selector.ITEM))
      return this._items.indexOf(element)
    }

    _getItemByDirection(direction, activeElement) {
      const isNextDirection = direction === Direction.NEXT
      const isPrevDirection = direction === Direction.PREV
      const activeIndex     = this._getItemIndex(activeElement)
      const lastItemIndex   = this._items.length - 1
      const isGoingToWrap   = isPrevDirection && activeIndex === 0 ||
                              isNextDirection && activeIndex === lastItemIndex

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement
      }

      const delta     = direction === Direction.PREV ? -1 : 1
      const itemIndex = (activeIndex + delta) % this._items.length

      return itemIndex === -1
        ? this._items[this._items.length - 1] : this._items[itemIndex]
    }

    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget)
      const fromIndex = this._getItemIndex($(this._element).find(Selector.ACTIVE_ITEM)[0])
      const slideEvent = $.Event(Event.SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      })

      $(this._element).trigger(slideEvent)

      return slideEvent
    }

    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        $(this._indicatorsElement)
          .find(Selector.ACTIVE)
          .removeClass(ClassName.ACTIVE)

        const nextIndicator = this._indicatorsElement.children[
          this._getItemIndex(element)
        ]

        if (nextIndicator) {
          $(nextIndicator).addClass(ClassName.ACTIVE)
        }
      }
    }

    _slide(direction, element) {
      const activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0]
      const activeElementIndex = this._getItemIndex(activeElement)
      const nextElement   = element || activeElement &&
        this._getItemByDirection(direction, activeElement)
      const nextElementIndex = this._getItemIndex(nextElement)
      const isCycling = Boolean(this._interval)

      let directionalClassName
      let orderClassName
      let eventDirectionName

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName.LEFT
        orderClassName = ClassName.NEXT
        eventDirectionName = Direction.LEFT
      } else {
        directionalClassName = ClassName.RIGHT
        orderClassName = ClassName.PREV
        eventDirectionName = Direction.RIGHT
      }

      if (nextElement && $(nextElement).hasClass(ClassName.ACTIVE)) {
        this._isSliding = false
        return
      }

      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName)
      if (slideEvent.isDefaultPrevented()) {
        return
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return
      }

      this._isSliding = true

      if (isCycling) {
        this.pause()
      }

      this._setActiveIndicatorElement(nextElement)

      const slidEvent = $.Event(Event.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      })

      if (Util.supportsTransitionEnd() &&
        $(this._element).hasClass(ClassName.SLIDE)) {
        $(nextElement).addClass(orderClassName)

        Util.reflow(nextElement)

        $(activeElement).addClass(directionalClassName)
        $(nextElement).addClass(directionalClassName)

        $(activeElement)
          .one(Util.TRANSITION_END, () => {
            $(nextElement)
              .removeClass(`${directionalClassName} ${orderClassName}`)
              .addClass(ClassName.ACTIVE)

            $(activeElement).removeClass(`${ClassName.ACTIVE} ${orderClassName} ${directionalClassName}`)

            this._isSliding = false

            setTimeout(() => $(this._element).trigger(slidEvent), 0)
          })
          .emulateTransitionEnd(TRANSITION_DURATION)
      } else {
        $(activeElement).removeClass(ClassName.ACTIVE)
        $(nextElement).addClass(ClassName.ACTIVE)

        this._isSliding = false
        $(this._element).trigger(slidEvent)
      }

      if (isCycling) {
        this.cycle()
      }
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)
        let _config = {
          ...Default,
          ...$(this).data()
        }

        if (typeof config === 'object') {
          _config = {
            ..._config,
            ...config
          }
        }

        const action = typeof config === 'string' ? config : _config.slide

        if (!data) {
          data = new Carousel(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'number') {
          data.to(config)
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError(`No method named "${action}"`)
          }
          data[action]()
        } else if (_config.interval) {
          data.pause()
          data.cycle()
        }
      })
    }

    static _dataApiClickHandler(event) {
      const selector = Util.getSelectorFromElement(this)

      if (!selector) {
        return
      }

      const target = $(selector)[0]

      if (!target || !$(target).hasClass(ClassName.CAROUSEL)) {
        return
      }

      const config = {
        ...$(target).data(),
        ...$(this).data()
      }
      const slideIndex = this.getAttribute('data-slide-to')

      if (slideIndex) {
        config.interval = false
      }

      Carousel._jQueryInterface.call($(target), config)

      if (slideIndex) {
        $(target).data(DATA_KEY).to(slideIndex)
      }

      event.preventDefault()
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document)
    .on(Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler)

  $(window).on(Event.LOAD_DATA_API, () => {
    $(Selector.DATA_RIDE).each(function () {
      const $carousel = $(this)
      Carousel._jQueryInterface.call($carousel, $carousel.data())
    })
  })

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Carousel._jQueryInterface
  $.fn[NAME].Constructor = Carousel
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Carousel._jQueryInterface
  }

  return Carousel
})($)

export default Carousel



import $ from 'jquery'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Collapse = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'collapse'
  const VERSION             = '4.0.0'
  const DATA_KEY            = 'bs.collapse'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 600

  const Default = {
    toggle : true,
    parent : ''
  }

  const DefaultType = {
    toggle : 'boolean',
    parent : '(string|element)'
  }

  const Event = {
    SHOW           : `show${EVENT_KEY}`,
    SHOWN          : `shown${EVENT_KEY}`,
    HIDE           : `hide${EVENT_KEY}`,
    HIDDEN         : `hidden${EVENT_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    SHOW       : 'show',
    COLLAPSE   : 'collapse',
    COLLAPSING : 'collapsing',
    COLLAPSED  : 'collapsed'
  }

  const Dimension = {
    WIDTH  : 'width',
    HEIGHT : 'height'
  }

  const Selector = {
    ACTIVES     : '.show, .collapsing',
    DATA_TOGGLE : '[data-toggle="collapse"]'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse {
    constructor(element, config) {
      this._isTransitioning = false
      this._element         = element
      this._config          = this._getConfig(config)
      this._triggerArray    = $.makeArray($(
        `[data-toggle="collapse"][href="#${element.id}"],` +
        `[data-toggle="collapse"][data-target="#${element.id}"]`
      ))
      const tabToggles = $(Selector.DATA_TOGGLE)
      for (let i = 0; i < tabToggles.length; i++) {
        const elem = tabToggles[i]
        const selector = Util.getSelectorFromElement(elem)
        if (selector !== null && $(selector).filter(element).length > 0) {
          this._selector = selector
          this._triggerArray.push(elem)
        }
      }

      this._parent = this._config.parent ? this._getParent() : null

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray)
      }

      if (this._config.toggle) {
        this.toggle()
      }
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }

    // Public

    toggle() {
      if ($(this._element).hasClass(ClassName.SHOW)) {
        this.hide()
      } else {
        this.show()
      }
    }

    show() {
      if (this._isTransitioning ||
        $(this._element).hasClass(ClassName.SHOW)) {
        return
      }

      let actives
      let activesData

      if (this._parent) {
        actives = $.makeArray(
          $(this._parent)
            .find(Selector.ACTIVES)
            .filter(`[data-parent="${this._config.parent}"]`)
        )
        if (actives.length === 0) {
          actives = null
        }
      }

      if (actives) {
        activesData = $(actives).not(this._selector).data(DATA_KEY)
        if (activesData && activesData._isTransitioning) {
          return
        }
      }

      const startEvent = $.Event(Event.SHOW)
      $(this._element).trigger(startEvent)
      if (startEvent.isDefaultPrevented()) {
        return
      }

      if (actives) {
        Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide')
        if (!activesData) {
          $(actives).data(DATA_KEY, null)
        }
      }

      const dimension = this._getDimension()

      $(this._element)
        .removeClass(ClassName.COLLAPSE)
        .addClass(ClassName.COLLAPSING)

      this._element.style[dimension] = 0

      if (this._triggerArray.length > 0) {
        $(this._triggerArray)
          .removeClass(ClassName.COLLAPSED)
          .attr('aria-expanded', true)
      }

      this.setTransitioning(true)

      const complete = () => {
        $(this._element)
          .removeClass(ClassName.COLLAPSING)
          .addClass(ClassName.COLLAPSE)
          .addClass(ClassName.SHOW)

        this._element.style[dimension] = ''

        this.setTransitioning(false)

        $(this._element).trigger(Event.SHOWN)
      }

      if (!Util.supportsTransitionEnd()) {
        complete()
        return
      }

      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1)
      const scrollSize = `scroll${capitalizedDimension}`

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(TRANSITION_DURATION)

      this._element.style[dimension] = `${this._element[scrollSize]}px`
    }

    hide() {
      if (this._isTransitioning ||
        !$(this._element).hasClass(ClassName.SHOW)) {
        return
      }

      const startEvent = $.Event(Event.HIDE)
      $(this._element).trigger(startEvent)
      if (startEvent.isDefaultPrevented()) {
        return
      }

      const dimension = this._getDimension()

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`

      Util.reflow(this._element)

      $(this._element)
        .addClass(ClassName.COLLAPSING)
        .removeClass(ClassName.COLLAPSE)
        .removeClass(ClassName.SHOW)

      if (this._triggerArray.length > 0) {
        for (let i = 0; i < this._triggerArray.length; i++) {
          const trigger = this._triggerArray[i]
          const selector = Util.getSelectorFromElement(trigger)
          if (selector !== null) {
            const $elem = $(selector)
            if (!$elem.hasClass(ClassName.SHOW)) {
              $(trigger).addClass(ClassName.COLLAPSED)
                .attr('aria-expanded', false)
            }
          }
        }
      }

      this.setTransitioning(true)

      const complete = () => {
        this.setTransitioning(false)
        $(this._element)
          .removeClass(ClassName.COLLAPSING)
          .addClass(ClassName.COLLAPSE)
          .trigger(Event.HIDDEN)
      }

      this._element.style[dimension] = ''

      if (!Util.supportsTransitionEnd()) {
        complete()
        return
      }

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(TRANSITION_DURATION)
    }

    setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)

      this._config          = null
      this._parent          = null
      this._element         = null
      this._triggerArray    = null
      this._isTransitioning = null
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default,
        ...config
      }
      config.toggle = Boolean(config.toggle) // Coerce string values
      Util.typeCheckConfig(NAME, config, DefaultType)
      return config
    }

    _getDimension() {
      const hasWidth = $(this._element).hasClass(Dimension.WIDTH)
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT
    }

    _getParent() {
      let parent = null
      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent

        // It's a jQuery object
        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0]
        }
      } else {
        parent = $(this._config.parent)[0]
      }

      const selector =
        `[data-toggle="collapse"][data-parent="${this._config.parent}"]`

      $(parent).find(selector).each((i, element) => {
        this._addAriaAndCollapsedClass(
          Collapse._getTargetFromElement(element),
          [element]
        )
      })

      return parent
    }

    _addAriaAndCollapsedClass(element, triggerArray) {
      if (element) {
        const isOpen = $(element).hasClass(ClassName.SHOW)

        if (triggerArray.length > 0) {
          $(triggerArray)
            .toggleClass(ClassName.COLLAPSED, !isOpen)
            .attr('aria-expanded', isOpen)
        }
      }
    }

    // Static

    static _getTargetFromElement(element) {
      const selector = Util.getSelectorFromElement(element)
      return selector ? $(selector)[0] : null
    }

    static _jQueryInterface(config) {
      return this.each(function () {
        const $this   = $(this)
        let data      = $this.data(DATA_KEY)
        const _config = {
          ...Default,
          ...$this.data(),
          ...typeof config === 'object' && config
        }

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false
        }

        if (!data) {
          data = new Collapse(this, _config)
          $this.data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }
          data[config]()
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault()
    }

    const $trigger = $(this)
    const selector = Util.getSelectorFromElement(this)
    $(selector).each(function () {
      const $target = $(this)
      const data    = $target.data(DATA_KEY)
      const config  = data ? 'toggle' : $trigger.data()
      Collapse._jQueryInterface.call($target, config)
    })
  })

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Collapse._jQueryInterface
  $.fn[NAME].Constructor = Collapse
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Collapse._jQueryInterface
  }

  return Collapse
})($)

export default Collapse


import $ from 'jquery'
import Popper from 'popper.js'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Dropdown = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                     = 'dropdown'
  const VERSION                  = '4.0.0'
  const DATA_KEY                 = 'bs.dropdown'
  const EVENT_KEY                = `.${DATA_KEY}`
  const DATA_API_KEY             = '.data-api'
  const JQUERY_NO_CONFLICT       = $.fn[NAME]
  const ESCAPE_KEYCODE           = 27 // KeyboardEvent.which value for Escape (Esc) key
  const SPACE_KEYCODE            = 32 // KeyboardEvent.which value for space key
  const TAB_KEYCODE              = 9 // KeyboardEvent.which value for tab key
  const ARROW_UP_KEYCODE         = 38 // KeyboardEvent.which value for up arrow key
  const ARROW_DOWN_KEYCODE       = 40 // KeyboardEvent.which value for down arrow key
  const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
  const REGEXP_KEYDOWN           = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`)

  const Event = {
    HIDE             : `hide${EVENT_KEY}`,
    HIDDEN           : `hidden${EVENT_KEY}`,
    SHOW             : `show${EVENT_KEY}`,
    SHOWN            : `shown${EVENT_KEY}`,
    CLICK            : `click${EVENT_KEY}`,
    CLICK_DATA_API   : `click${EVENT_KEY}${DATA_API_KEY}`,
    KEYDOWN_DATA_API : `keydown${EVENT_KEY}${DATA_API_KEY}`,
    KEYUP_DATA_API   : `keyup${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    DISABLED  : 'disabled',
    SHOW      : 'show',
    DROPUP    : 'dropup',
    DROPRIGHT : 'dropright',
    DROPLEFT  : 'dropleft',
    MENURIGHT : 'dropdown-menu-right',
    MENULEFT  : 'dropdown-menu-left',
    POSITION_STATIC : 'position-static'
  }

  const Selector = {
    DATA_TOGGLE   : '[data-toggle="dropdown"]',
    FORM_CHILD    : '.dropdown form',
    MENU          : '.dropdown-menu',
    NAVBAR_NAV    : '.navbar-nav',
    VISIBLE_ITEMS : '.dropdown-menu .dropdown-item:not(.disabled)'
  }

  const AttachmentMap = {
    TOP       : 'top-start',
    TOPEND    : 'top-end',
    BOTTOM    : 'bottom-start',
    BOTTOMEND : 'bottom-end',
    RIGHT     : 'right-start',
    RIGHTEND  : 'right-end',
    LEFT      : 'left-start',
    LEFTEND   : 'left-end'
  }

  const Default = {
    offset      : 0,
    flip        : true,
    boundary    : 'scrollParent'
  }

  const DefaultType = {
    offset      : '(number|string|function)',
    flip        : 'boolean',
    boundary    : '(string|element)'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown {
    constructor(element, config) {
      this._element  = element
      this._popper   = null
      this._config   = this._getConfig(config)
      this._menu     = this._getMenuElement()
      this._inNavbar = this._detectNavbar()

      this._addEventListeners()
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }

    static get DefaultType() {
      return DefaultType
    }

    // Public

    toggle() {
      if (this._element.disabled || $(this._element).hasClass(ClassName.DISABLED)) {
        return
      }

      const parent   = Dropdown._getParentFromElement(this._element)
      const isActive = $(this._menu).hasClass(ClassName.SHOW)

      Dropdown._clearMenus()

      if (isActive) {
        return
      }

      const relatedTarget = {
        relatedTarget: this._element
      }
      const showEvent = $.Event(Event.SHOW, relatedTarget)

      $(parent).trigger(showEvent)

      if (showEvent.isDefaultPrevented()) {
        return
      }

      // Disable totally Popper.js for Dropdown in Navbar
      if (!this._inNavbar) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap dropdown require Popper.js (https://popper.js.org)')
        }
        let element = this._element
        // For dropup with alignment we use the parent as popper container
        if ($(parent).hasClass(ClassName.DROPUP)) {
          if ($(this._menu).hasClass(ClassName.MENULEFT) || $(this._menu).hasClass(ClassName.MENURIGHT)) {
            element = parent
          }
        }
        // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251
        if (this._config.boundary !== 'scrollParent') {
          $(parent).addClass(ClassName.POSITION_STATIC)
        }
        this._popper = new Popper(element, this._menu, this._getPopperConfig())
      }

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement &&
         $(parent).closest(Selector.NAVBAR_NAV).length === 0) {
        $('body').children().on('mouseover', null, $.noop)
      }

      this._element.focus()
      this._element.setAttribute('aria-expanded', true)

      $(this._menu).toggleClass(ClassName.SHOW)
      $(parent)
        .toggleClass(ClassName.SHOW)
        .trigger($.Event(Event.SHOWN, relatedTarget))
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      $(this._element).off(EVENT_KEY)
      this._element = null
      this._menu = null
      if (this._popper !== null) {
        this._popper.destroy()
        this._popper = null
      }
    }

    update() {
      this._inNavbar = this._detectNavbar()
      if (this._popper !== null) {
        this._popper.scheduleUpdate()
      }
    }

    // Private

    _addEventListeners() {
      $(this._element).on(Event.CLICK, (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.toggle()
      })
    }

    _getConfig(config) {
      config = {
        ...this.constructor.Default,
        ...$(this._element).data(),
        ...config
      }

      Util.typeCheckConfig(
        NAME,
        config,
        this.constructor.DefaultType
      )

      return config
    }

    _getMenuElement() {
      if (!this._menu) {
        const parent = Dropdown._getParentFromElement(this._element)
        this._menu = $(parent).find(Selector.MENU)[0]
      }
      return this._menu
    }

    _getPlacement() {
      const $parentDropdown = $(this._element).parent()
      let placement = AttachmentMap.BOTTOM

      // Handle dropup
      if ($parentDropdown.hasClass(ClassName.DROPUP)) {
        placement = AttachmentMap.TOP
        if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
          placement = AttachmentMap.TOPEND
        }
      } else if ($parentDropdown.hasClass(ClassName.DROPRIGHT)) {
        placement = AttachmentMap.RIGHT
      } else if ($parentDropdown.hasClass(ClassName.DROPLEFT)) {
        placement = AttachmentMap.LEFT
      } else if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND
      }
      return placement
    }

    _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0
    }

    _getPopperConfig() {
      const offsetConf = {}
      if (typeof this._config.offset === 'function') {
        offsetConf.fn = (data) => {
          data.offsets = {
            ...data.offsets,
            ...this._config.offset(data.offsets) || {}
          }
          return data
        }
      } else {
        offsetConf.offset = this._config.offset
      }
      const popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: offsetConf,
          flip: {
            enabled: this._config.flip
          },
          preventOverflow: {
            boundariesElement: this._config.boundary
          }
        }
      }

      return popperConfig
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)
        const _config = typeof config === 'object' ? config : null

        if (!data) {
          data = new Dropdown(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }
          data[config]()
        }
      })
    }

    static _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH ||
        event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return
      }

      const toggles = $.makeArray($(Selector.DATA_TOGGLE))
      for (let i = 0; i < toggles.length; i++) {
        const parent = Dropdown._getParentFromElement(toggles[i])
        const context = $(toggles[i]).data(DATA_KEY)
        const relatedTarget = {
          relatedTarget: toggles[i]
        }

        if (!context) {
          continue
        }

        const dropdownMenu = context._menu
        if (!$(parent).hasClass(ClassName.SHOW)) {
          continue
        }

        if (event && (event.type === 'click' &&
            /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) &&
            $.contains(parent, event.target)) {
          continue
        }

        const hideEvent = $.Event(Event.HIDE, relatedTarget)
        $(parent).trigger(hideEvent)
        if (hideEvent.isDefaultPrevented()) {
          continue
        }

        // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
          $('body').children().off('mouseover', null, $.noop)
        }

        toggles[i].setAttribute('aria-expanded', 'false')

        $(dropdownMenu).removeClass(ClassName.SHOW)
        $(parent)
          .removeClass(ClassName.SHOW)
          .trigger($.Event(Event.HIDDEN, relatedTarget))
      }
    }

    static _getParentFromElement(element) {
      let parent
      const selector = Util.getSelectorFromElement(element)

      if (selector) {
        parent = $(selector)[0]
      }

      return parent || element.parentNode
    }

    // eslint-disable-next-line complexity
    static _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName)
        ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE &&
        (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE ||
          $(event.target).closest(Selector.MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
        return
      }

      const parent   = Dropdown._getParentFromElement(this)
      const isActive = $(parent).hasClass(ClassName.SHOW)

      if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) ||
           isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
        if (event.which === ESCAPE_KEYCODE) {
          const toggle = $(parent).find(Selector.DATA_TOGGLE)[0]
          $(toggle).trigger('focus')
        }

        $(this).trigger('click')
        return
      }

      const items = $(parent).find(Selector.VISIBLE_ITEMS).get()

      if (items.length === 0) {
        return
      }

      let index = items.indexOf(event.target)

      if (event.which === ARROW_UP_KEYCODE && index > 0) { // Up
        index--
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) { // Down
        index++
      }

      if (index < 0) {
        index = 0
      }

      items[index].focus()
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document)
    .on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Dropdown._dataApiKeydownHandler)
    .on(Event.KEYDOWN_DATA_API, Selector.MENU, Dropdown._dataApiKeydownHandler)
    .on(`${Event.CLICK_DATA_API} ${Event.KEYUP_DATA_API}`, Dropdown._clearMenus)
    .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      event.preventDefault()
      event.stopPropagation()
      Dropdown._jQueryInterface.call($(this), 'toggle')
    })
    .on(Event.CLICK_DATA_API, Selector.FORM_CHILD, (e) => {
      e.stopPropagation()
    })

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Dropdown._jQueryInterface
  $.fn[NAME].Constructor = Dropdown
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Dropdown._jQueryInterface
  }

  return Dropdown
})($, Popper)

export default Dropdown


import $ from 'jquery'
import Alert from './alert'
import Button from './button'
import Carousel from './carousel'
import Collapse from './collapse'
import Dropdown from './dropdown'
import Modal from './modal'
import Popover from './popover'
import Scrollspy from './scrollspy'
import Tab from './tab'
import Tooltip from './tooltip'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(($) => {
  if (typeof $ === 'undefined') {
    throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.')
  }

  const version = $.fn.jquery.split(' ')[0].split('.')
  const minMajor = 1
  const ltMajor = 2
  const minMinor = 9
  const minPatch = 1
  const maxMajor = 4

  if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
    throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0')
  }
})($)

export {
  Util,
  Alert,
  Button,
  Carousel,
  Collapse,
  Dropdown,
  Modal,
  Popover,
  Scrollspy,
  Tab,
  Tooltip
}
import $ from 'jquery'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Modal = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                         = 'modal'
  const VERSION                      = '4.0.0'
  const DATA_KEY                     = 'bs.modal'
  const EVENT_KEY                    = `.${DATA_KEY}`
  const DATA_API_KEY                 = '.data-api'
  const JQUERY_NO_CONFLICT           = $.fn[NAME]
  const TRANSITION_DURATION          = 300
  const BACKDROP_TRANSITION_DURATION = 150
  const ESCAPE_KEYCODE               = 27 // KeyboardEvent.which value for Escape (Esc) key

  const Default = {
    backdrop : true,
    keyboard : true,
    focus    : true,
    show     : true
  }

  const DefaultType = {
    backdrop : '(boolean|string)',
    keyboard : 'boolean',
    focus    : 'boolean',
    show     : 'boolean'
  }

  const Event = {
    HIDE              : `hide${EVENT_KEY}`,
    HIDDEN            : `hidden${EVENT_KEY}`,
    SHOW              : `show${EVENT_KEY}`,
    SHOWN             : `shown${EVENT_KEY}`,
    FOCUSIN           : `focusin${EVENT_KEY}`,
    RESIZE            : `resize${EVENT_KEY}`,
    CLICK_DISMISS     : `click.dismiss${EVENT_KEY}`,
    KEYDOWN_DISMISS   : `keydown.dismiss${EVENT_KEY}`,
    MOUSEUP_DISMISS   : `mouseup.dismiss${EVENT_KEY}`,
    MOUSEDOWN_DISMISS : `mousedown.dismiss${EVENT_KEY}`,
    CLICK_DATA_API    : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    SCROLLBAR_MEASURER : 'modal-scrollbar-measure',
    BACKDROP           : 'modal-backdrop',
    OPEN               : 'modal-open',
    FADE               : 'fade',
    SHOW               : 'show'
  }

  const Selector = {
    DIALOG             : '.modal-dialog',
    DATA_TOGGLE        : '[data-toggle="modal"]',
    DATA_DISMISS       : '[data-dismiss="modal"]',
    FIXED_CONTENT      : '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
    STICKY_CONTENT     : '.sticky-top',
    NAVBAR_TOGGLER     : '.navbar-toggler'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Modal {
    constructor(element, config) {
      this._config              = this._getConfig(config)
      this._element             = element
      this._dialog              = $(element).find(Selector.DIALOG)[0]
      this._backdrop            = null
      this._isShown             = false
      this._isBodyOverflowing   = false
      this._ignoreBackdropClick = false
      this._originalBodyPadding = 0
      this._scrollbarWidth      = 0
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }

    // Public

    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget)
    }

    show(relatedTarget) {
      if (this._isTransitioning || this._isShown) {
        return
      }

      if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
        this._isTransitioning = true
      }

      const showEvent = $.Event(Event.SHOW, {
        relatedTarget
      })

      $(this._element).trigger(showEvent)

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return
      }

      this._isShown = true

      this._checkScrollbar()
      this._setScrollbar()

      this._adjustDialog()

      $(document.body).addClass(ClassName.OPEN)

      this._setEscapeEvent()
      this._setResizeEvent()

      $(this._element).on(
        Event.CLICK_DISMISS,
        Selector.DATA_DISMISS,
        (event) => this.hide(event)
      )

      $(this._dialog).on(Event.MOUSEDOWN_DISMISS, () => {
        $(this._element).one(Event.MOUSEUP_DISMISS, (event) => {
          if ($(event.target).is(this._element)) {
            this._ignoreBackdropClick = true
          }
        })
      })

      this._showBackdrop(() => this._showElement(relatedTarget))
    }

    hide(event) {
      if (event) {
        event.preventDefault()
      }

      if (this._isTransitioning || !this._isShown) {
        return
      }

      const hideEvent = $.Event(Event.HIDE)

      $(this._element).trigger(hideEvent)

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return
      }

      this._isShown = false

      const transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)

      if (transition) {
        this._isTransitioning = true
      }

      this._setEscapeEvent()
      this._setResizeEvent()

      $(document).off(Event.FOCUSIN)

      $(this._element).removeClass(ClassName.SHOW)

      $(this._element).off(Event.CLICK_DISMISS)
      $(this._dialog).off(Event.MOUSEDOWN_DISMISS)

      if (transition) {
        $(this._element)
          .one(Util.TRANSITION_END, (event) => this._hideModal(event))
          .emulateTransitionEnd(TRANSITION_DURATION)
      } else {
        this._hideModal()
      }
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)

      $(window, document, this._element, this._backdrop).off(EVENT_KEY)

      this._config              = null
      this._element             = null
      this._dialog              = null
      this._backdrop            = null
      this._isShown             = null
      this._isBodyOverflowing   = null
      this._ignoreBackdropClick = null
      this._scrollbarWidth      = null
    }

    handleUpdate() {
      this._adjustDialog()
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default,
        ...config
      }
      Util.typeCheckConfig(NAME, config, DefaultType)
      return config
    }

    _showElement(relatedTarget) {
      const transition = Util.supportsTransitionEnd() &&
        $(this._element).hasClass(ClassName.FADE)

      if (!this._element.parentNode ||
         this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element)
      }

      this._element.style.display = 'block'
      this._element.removeAttribute('aria-hidden')
      this._element.scrollTop = 0

      if (transition) {
        Util.reflow(this._element)
      }

      $(this._element).addClass(ClassName.SHOW)

      if (this._config.focus) {
        this._enforceFocus()
      }

      const shownEvent = $.Event(Event.SHOWN, {
        relatedTarget
      })

      const transitionComplete = () => {
        if (this._config.focus) {
          this._element.focus()
        }
        this._isTransitioning = false
        $(this._element).trigger(shownEvent)
      }

      if (transition) {
        $(this._dialog)
          .one(Util.TRANSITION_END, transitionComplete)
          .emulateTransitionEnd(TRANSITION_DURATION)
      } else {
        transitionComplete()
      }
    }

    _enforceFocus() {
      $(document)
        .off(Event.FOCUSIN) // Guard against infinite focus loop
        .on(Event.FOCUSIN, (event) => {
          if (document !== event.target &&
              this._element !== event.target &&
              $(this._element).has(event.target).length === 0) {
            this._element.focus()
          }
        })
    }

    _setEscapeEvent() {
      if (this._isShown && this._config.keyboard) {
        $(this._element).on(Event.KEYDOWN_DISMISS, (event) => {
          if (event.which === ESCAPE_KEYCODE) {
            event.preventDefault()
            this.hide()
          }
        })
      } else if (!this._isShown) {
        $(this._element).off(Event.KEYDOWN_DISMISS)
      }
    }

    _setResizeEvent() {
      if (this._isShown) {
        $(window).on(Event.RESIZE, (event) => this.handleUpdate(event))
      } else {
        $(window).off(Event.RESIZE)
      }
    }

    _hideModal() {
      this._element.style.display = 'none'
      this._element.setAttribute('aria-hidden', true)
      this._isTransitioning = false
      this._showBackdrop(() => {
        $(document.body).removeClass(ClassName.OPEN)
        this._resetAdjustments()
        this._resetScrollbar()
        $(this._element).trigger(Event.HIDDEN)
      })
    }

    _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove()
        this._backdrop = null
      }
    }

    _showBackdrop(callback) {
      const animate = $(this._element).hasClass(ClassName.FADE)
        ? ClassName.FADE : ''

      if (this._isShown && this._config.backdrop) {
        const doAnimate = Util.supportsTransitionEnd() && animate

        this._backdrop = document.createElement('div')
        this._backdrop.className = ClassName.BACKDROP

        if (animate) {
          $(this._backdrop).addClass(animate)
        }

        $(this._backdrop).appendTo(document.body)

        $(this._element).on(Event.CLICK_DISMISS, (event) => {
          if (this._ignoreBackdropClick) {
            this._ignoreBackdropClick = false
            return
          }
          if (event.target !== event.currentTarget) {
            return
          }
          if (this._config.backdrop === 'static') {
            this._element.focus()
          } else {
            this.hide()
          }
        })

        if (doAnimate) {
          Util.reflow(this._backdrop)
        }

        $(this._backdrop).addClass(ClassName.SHOW)

        if (!callback) {
          return
        }

        if (!doAnimate) {
          callback()
          return
        }

        $(this._backdrop)
          .one(Util.TRANSITION_END, callback)
          .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION)
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(ClassName.SHOW)

        const callbackRemove = () => {
          this._removeBackdrop()
          if (callback) {
            callback()
          }
        }

        if (Util.supportsTransitionEnd() &&
           $(this._element).hasClass(ClassName.FADE)) {
          $(this._backdrop)
            .one(Util.TRANSITION_END, callbackRemove)
            .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION)
        } else {
          callbackRemove()
        }
      } else if (callback) {
        callback()
      }
    }

    // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------

    _adjustDialog() {
      const isModalOverflowing =
        this._element.scrollHeight > document.documentElement.clientHeight

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = `${this._scrollbarWidth}px`
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = `${this._scrollbarWidth}px`
      }
    }

    _resetAdjustments() {
      this._element.style.paddingLeft = ''
      this._element.style.paddingRight = ''
    }

    _checkScrollbar() {
      const rect = document.body.getBoundingClientRect()
      this._isBodyOverflowing = rect.left + rect.right < window.innerWidth
      this._scrollbarWidth = this._getScrollbarWidth()
    }

    _setScrollbar() {
      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set

        // Adjust fixed content padding
        $(Selector.FIXED_CONTENT).each((index, element) => {
          const actualPadding = $(element)[0].style.paddingRight
          const calculatedPadding = $(element).css('padding-right')
          $(element).data('padding-right', actualPadding).css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`)
        })

        // Adjust sticky content margin
        $(Selector.STICKY_CONTENT).each((index, element) => {
          const actualMargin = $(element)[0].style.marginRight
          const calculatedMargin = $(element).css('margin-right')
          $(element).data('margin-right', actualMargin).css('margin-right', `${parseFloat(calculatedMargin) - this._scrollbarWidth}px`)
        })

        // Adjust navbar-toggler margin
        $(Selector.NAVBAR_TOGGLER).each((index, element) => {
          const actualMargin = $(element)[0].style.marginRight
          const calculatedMargin = $(element).css('margin-right')
          $(element).data('margin-right', actualMargin).css('margin-right', `${parseFloat(calculatedMargin) + this._scrollbarWidth}px`)
        })

        // Adjust body padding
        const actualPadding = document.body.style.paddingRight
        const calculatedPadding = $('body').css('padding-right')
        $('body').data('padding-right', actualPadding).css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`)
      }
    }

    _resetScrollbar() {
      // Restore fixed content padding
      $(Selector.FIXED_CONTENT).each((index, element) => {
        const padding = $(element).data('padding-right')
        if (typeof padding !== 'undefined') {
          $(element).css('padding-right', padding).removeData('padding-right')
        }
      })

      // Restore sticky content and navbar-toggler margin
      $(`${Selector.STICKY_CONTENT}, ${Selector.NAVBAR_TOGGLER}`).each((index, element) => {
        const margin = $(element).data('margin-right')
        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right')
        }
      })

      // Restore body padding
      const padding = $('body').data('padding-right')
      if (typeof padding !== 'undefined') {
        $('body').css('padding-right', padding).removeData('padding-right')
      }
    }

    _getScrollbarWidth() { // thx d.walsh
      const scrollDiv = document.createElement('div')
      scrollDiv.className = ClassName.SCROLLBAR_MEASURER
      document.body.appendChild(scrollDiv)
      const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
      document.body.removeChild(scrollDiv)
      return scrollbarWidth
    }

    // Static

    static _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)
        const _config = {
          ...Modal.Default,
          ...$(this).data(),
          ...typeof config === 'object' && config
        }

        if (!data) {
          data = new Modal(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }
          data[config](relatedTarget)
        } else if (_config.show) {
          data.show(relatedTarget)
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    let target
    const selector = Util.getSelectorFromElement(this)

    if (selector) {
      target = $(selector)[0]
    }

    const config = $(target).data(DATA_KEY)
      ? 'toggle' : {
        ...$(target).data(),
        ...$(this).data()
      }

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault()
    }

    const $target = $(target).one(Event.SHOW, (showEvent) => {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return
      }

      $target.one(Event.HIDDEN, () => {
        if ($(this).is(':visible')) {
          this.focus()
        }
      })
    })

    Modal._jQueryInterface.call($(target), config, this)
  })

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Modal._jQueryInterface
  $.fn[NAME].Constructor = Modal
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Modal._jQueryInterface
  }

  return Modal
})($)

export default Modal


