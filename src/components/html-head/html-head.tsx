import * as React from 'react'
import { Helmet } from 'react-helmet'

// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" />

const HTMLHead: React.FC = () => (
  <Helmet>
    <meta charSet="utf-8" />
    <title>moog</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css" />
    <link href="https://fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" type="text/css" />
  </Helmet>
)

export default HTMLHead
