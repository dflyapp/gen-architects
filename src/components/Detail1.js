export default function Detail1({ description, packages }) {
  return (
    <div className="mt-8 flex justify-end bg-gray-800 py-24">
      <div className="w-full sm:w-3/4 px-12">
        {description && <h1 className="text-xl sm:text-4xl text-white mb-24">{description}</h1>}
        {packages &&
          packages.map((ele, index) => {
            return (
              <div key={index} className="border-t border-white text-white p-4 flex items-top">
                <sub className="mr-2">{`0${index + 1}`}</sub>
                <h3 className="text-sm sm:text-4xl font-light">{ele}</h3>
              </div>
            )
          })}
      </div>
    </div>
  )
}
