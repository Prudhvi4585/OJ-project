import React from 'react'
import { useParams } from 'react-router-dom'

function Service() {
    let id = useParams().id
  return (
    <div>
        <h1>Service {id}</h1>
    </div>
  )
}

export default Service
