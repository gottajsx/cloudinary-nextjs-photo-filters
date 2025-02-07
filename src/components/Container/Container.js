import styles from './Container.module.scss';

const Container = ({ children, ...rest }) => {

  let containerClassName = styles.container;

  // if ( className ) {
  //   containerClassName = `${containerClassName} ${className}`;
  // }

  return (
    <div className={containerClassName} {...rest}>
      { children }
    </div>
  )
}

export default Container;