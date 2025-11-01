import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate, useLocation } from 'react-router'

import {
  img,
  outerContainer,
  innerContainer,
  cardContainer,
  pageTitle,
  textContainer,
  text,
  button,
} from './404.module.css'

export const Component = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const onClickBack = () => navigate(`/${search}`)

  return (
    <div className={outerContainer}>
      <picture>
        <source
          srcSet="home_700.avif 700w, home_1000.avif 1000w, home_1400.avif 1400w, home_2000.avif 2000w, home_2500.avif 2500w"
          type="image/avif"
        />
        <img
          className={img}
          src="home_700.webp"
          srcSet="home_700.webp 700w, home_1000.webp 1000w, home_1400.webp 1400w, home_2000.webp 2000w, home_2500.webp 2500w"
          sizes="100vw"
          alt="Spinnen-Ragwurz"
        />
      </picture>
      <div className={innerContainer}>
        <Typography
          align="center"
          variant="h6"
          color="inherit"
          className={pageTitle}
        >
          Bedrohte Pflanzenarten fördern
        </Typography>
        <div className={cardContainer}>
          <div className={textContainer}>
            <Typography
              align="center"
              variant="h6"
              className={pageTitle}
            >
              Oh je
            </Typography>
          </div>
          <div className={textContainer}>
            <Typography
              align="center"
              variant="h6"
              className={text}
            >
              Diese Seite ist nicht verfügbar.
            </Typography>
          </div>
          <div className={textContainer}>
            <Button
              variant="outlined"
              onClick={onClickBack}
              color="inherit"
              className={button}
            >
              Zur Startseite
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
