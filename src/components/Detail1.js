export default function Detail1({ description, packages }) {
  return (
    <div className="mt-8 flex justify-end bg-gray-800 py-24">
      <div className="w-3/4 px-12">
        {description && <h1 className="text-white mb-24">{description}</h1>}
        <div className="border-t-2 border-white text-white p-4 flex items-top">
          <sub className="mr-2">01</sub>
          <h3>Site Analysis</h3>
        </div>

        {packages &&
          packages.map((ele, index) => {
            return (
              <div key={index} className="border-t-2 border-white text-white p-4 flex items-top">
                <sub className="mr-2">{`0${index + 1}`}</sub>
                <h3>{ele}</h3>
              </div>
            )
          })}
      </div>
    </div>
  )
}
