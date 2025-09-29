/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import WriteCompo from '@/pages/dash-board/components/writeCompo';

export default function DashBoard() {
  return(
    <Div>
      <WriteCompo />
    </Div>
  )
}

const Div = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items: center;
`

