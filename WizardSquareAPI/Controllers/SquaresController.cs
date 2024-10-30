using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace WizardSquareAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SquaresController : ControllerBase
    {
        private const string filePath = "squares.json";

        // GET: api/squares
        [HttpGet]
        public ActionResult<List<Square>> GetSquares()
        {
            if (!System.IO.File.Exists(filePath))
            {
                return Ok(new List<Square>()); // Return an empty list if no file exists
            }

            var jsonData = System.IO.File.ReadAllText(filePath);
            var squares = JsonSerializer.Deserialize<List<Square>>(jsonData);
            return Ok(squares);
        }

        // POST: api/squares
        [HttpPost]
        public ActionResult<Square> AddSquare([FromBody] Square square)
        {
            var squares = new List<Square>();

            if (System.IO.File.Exists(filePath))
            {
                var jsonData = System.IO.File.ReadAllText(filePath);
                squares = JsonSerializer.Deserialize<List<Square>>(jsonData);
            }

            // Assign a unique ID to the new square
            square.Id = squares.Count > 0 ? squares.Max(s => s.Id) + 1 : 1; // Increment the highest ID

            squares.Add(square);

            // Serialize the updated squares list to JSON
            var json = JsonSerializer.Serialize(squares);
            System.IO.File.WriteAllText(filePath, json); // Save the new list back to the file

            return CreatedAtAction(nameof(GetSquares), new { id = square.Id }, square);
        }
    

    [HttpDelete("clear")]
        public ActionResult ClearSquares()
        {
            // Clear the squares.json file by writing an empty array
            System.IO.File.WriteAllText(filePath, "[]");
            return Ok("Squares cleared.");
        }
    }
}
