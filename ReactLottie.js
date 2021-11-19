import React from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';

export default class Lottie extends React.Component {
  containerRef = React.createRef();

  componentDidMount() {
    const {
      options,
      eventListeners,
    } = this.props;

    const {
      loop,
      autoplay,
      animationData,
      rendererSettings,
      segments,
    } = options;

    this.options = {
      container: this.containerRef.current,
      renderer: 'svg',
      loop: loop !== false,
      autoplay: autoplay !== false,
      segments: segments !== false,
      animationData,
      rendererSettings,
    };

    this.options = { ...this.options, ...options };

    this.anim = lottie.loadAnimation(this.options);
    this.registerEvents(eventListeners);
  }

  componentDidUpdate(prevProps) {
    const { options: { animationData } } = this.props;
    if (animationData !== prevProps.options.animationData) {
      this.unregisterEvents(prevProps.eventListeners);
      this.destroy();
      this.options = { ...this.options, ...this.props.options };
      this.anim = lottie.loadAnimation(this.options);
      this.registerEvents(this.props.eventListeners);
      this.play();
    }

    if (this.props.isStopped) {
      this.stop();
    } else if (this.props.segments) {
      this.playSegments();
    } else if (prevProps.isStopped && !this.props.isStopped) {
      this.play();
    }

    this.pause();
    this.setSpeed();
    this.setDirection();
  }

  componentWillUnmount() {
    this.unregisterEvents(this.props.eventListeners);
    this.destroy();
    this.options.animationData = null;
    this.anim = null;
  }

  setSpeed() {
    this.anim.setSpeed(this.props.speed);
  }

  setDirection() {
    this.anim.setDirection(this.props.direction);
  }

  play() {
    this.anim.play();
  }

  playSegments() {
    this.anim.playSegments(this.props.segments);
  }

  stop() {
    this.anim.stop();
  }

  pause() {
    if (this.props.isPaused && !this.anim.isPaused) {
      this.anim.pause();
    } else if (!this.props.isPaused && this.anim.isPaused) {
      this.anim.pause();
    }
  }

  destroy() {
    this.anim.destroy();
  }

  registerEvents(eventListeners) {
    eventListeners.forEach((eventListener) => {
      this.anim.addEventListener(eventListener.eventName, eventListener.callback);
    });
  }

  unregisterEvents(eventListeners) {
    eventListeners.forEach((eventListener) => {
      this.anim.removeEventListener(eventListener.eventName, eventListener.callback);
    });
  }

  handleClickToPause = () => {
    // The pause() method is for handling pausing by passing a prop isPaused
    // This method is for handling the ability to pause by clicking on the animation
    if (this.anim.isPaused) {
      this.anim.play();
    } else {
      this.anim.pause();
    }
  }

  render() {
    const {
      width,
      height,
      isClickToPauseDisabled,
      title,
    } = this.props;

    const getSize = (initial) => {
      let size;

      if (typeof initial === 'number') {
        size = `${initial}px`;
      } else {
        size = initial || '100%';
      }

      return size;
    };

    const lottieStyles = {
      width: getSize(width),
      height: getSize(height),
      overflow: 'hidden',
      margin: '0 auto',
      outline: 'none',
      ...this.props.style,
    };

    const onClickHandler = isClickToPauseDisabled ? () => null : this.handleClickToPause;

    return (
      <div
        ref={this.containerRef}
        style={lottieStyles}
        onClick={onClickHandler}
        title={title}
        aria-hidden="true"
      />
    );
  }
}

Lottie.propTypes = {
  eventListeners: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  segments: PropTypes.arrayOf(PropTypes.number),
  direction: PropTypes.number,
  isClickToPauseDisabled: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.object,
};

Lottie.defaultProps = {
  style: {},
  eventListeners: [],
  isStopped: false,
  isPaused: false,
  speed: 1,
  isClickToPauseDisabled: false,
  title: '',
  direction: undefined,
  segments: undefined,
  width: undefined,
  height: undefined,
};
